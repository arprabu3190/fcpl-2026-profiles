(() => {
  const $ = s => document.querySelector(s);
  const db = supabase.createClient(FCPL_CONFIG.supabaseUrl, FCPL_CONFIG.supabasePublishableKey);
  let cachedPlayers = [], cachedTeams = [], currentState = null, pending = null;
  const money = v => '₹' + Number(v || 0).toLocaleString('en-IN');
  const initials = n => String(n || '').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const safe = v => v == null || v === '' ? '—' : String(v);

  async function fetchAll(){
    const [{data:p},{data:t},{data:s}] = await Promise.all([
      db.from('players').select('*').order('player_id'),
      db.from('teams').select('*').order('display_order'),
      db.from('auction_state').select('*').eq('id',1).maybeSingle()
    ]);
    cachedPlayers=p||[]; cachedTeams=t||[]; currentState=s||null;
    renderOnBlock(); renderSummary(); renderLog();
  }
  function playerPhoto(p){
    return p.photo_url ? `<img src="${p.photo_url}" alt="${p.player_name}">` : `<div class="on-block-placeholder">${initials(p.player_name)}</div>`;
  }
  function renderOnBlock(){
    const box=$('#onBlock'); if(!box)return;
    const p=currentState?.current_player_id ? cachedPlayers.find(x=>x.player_id===currentState.current_player_id) : null;
    if(!p){box.classList.add('hidden');box.innerHTML='';return;}
    box.classList.remove('hidden');
    box.innerHTML=`<div class="on-block-label"><span></span> NOW ON THE BLOCK</div><div class="on-block-main">${playerPhoto(p)}<div><small>${p.player_id} · ${safe(p.primary_role)}</small><h2>${p.player_name}</h2><p>${safe(p.batting_style)} · ${safe(p.bowling_style)}</p></div><button id="openCurrent">Open profile →</button></div>`;
    $('#openCurrent').onclick=()=>{ const pick=$('#pick'); if(pick){pick.value=p.player_id;pick.dispatchEvent(new Event('change'));} document.querySelector('[data-view="showcase"]').click(); };
  }
  function renderSummary(){
    const box=$('#auctionSummary'); if(!box)return;
    const count=st=>cachedPlayers.filter(p=>(p.auction_status||'Available')===st).length;
    const sold=cachedPlayers.filter(p=>p.auction_status==='Sold');
    const total=sold.reduce((n,p)=>n+Number(p.sold_price||0),0);
    const highest=sold.reduce((best,p)=>Number(p.sold_price||0)>Number(best?.sold_price||0)?p:best,null);
    box.innerHTML=`<div><small>AVAILABLE</small><b>${count('Available')}</b></div><div><small>SOLD</small><b>${count('Sold')}</b></div><div><small>UNSOLD</small><b>${count('Unsold')}</b></div><div><small>TOTAL AUCTION VALUE</small><b>${money(total)}</b></div><div><small>HIGHEST SALE</small><b>${highest?money(highest.sold_price):'—'}</b><em>${highest?highest.player_name:''}</em></div>`;
  }
  async function renderLog(){
    const box=$('#auctionLog'); if(!box)return;
    const {data,error}=await db.from('auction_log').select('*').order('created_at',{ascending:false}).limit(12);
    if(error){box.textContent='Sign in to view the activity log.';return;}
    box.innerHTML=(data||[]).map(x=>`<div class="log-row"><time>${new Date(x.created_at).toLocaleString('en-IN')}</time><b>${x.player_id}</b><span>${safe(x.old_status)} → ${safe(x.new_status)}</span><span>${safe(x.new_team_id)}</span><strong>${x.new_price==null?'':money(x.new_price)}</strong></div>`).join('') || 'No activity yet.';
  }
  async function getSession(){return (await db.auth.getSession()).data.session;}
  async function setCurrent(){
    const session=await getSession(); if(!session){$('#msg').textContent='Please sign in first.';return;}
    const playerId=$('#ap').value;
    const {error}=await db.from('auction_state').upsert({id:1,current_player_id:playerId,updated_by:session.user.email,updated_at:new Date().toISOString()});
    $('#msg').textContent=error?error.message:`${playerId} is now on the block.`;
  }
  function validate(p,status,teamId,price){
    if(status==='Sold'&&!teamId)return 'Select a team before confirming the sale.';
    if(status==='Sold'&&(!Number.isFinite(price)||price<=0))return 'Sold price must be greater than zero.';
    if(status==='Sold'){
      const team=cachedTeams.find(t=>t.team_id===teamId);
      if(team?.starting_purse!=null){
        const spent=cachedPlayers.filter(x=>x.auction_status==='Sold'&&x.team_id===teamId&&x.player_id!==p.player_id).reduce((n,x)=>n+Number(x.sold_price||0),0);
        if(spent+price>Number(team.starting_purse))return `This sale exceeds ${team.team_name}'s remaining purse of ${money(Number(team.starting_purse)-spent)}.`;
      }
    }
    return '';
  }
  async function prepareSave(){
    const session=await getSession(); if(!session){$('#msg').textContent='Please sign in again.';return;}
    const p=cachedPlayers.find(x=>x.player_id===$('#ap').value);
    if(!p){$('#msg').textContent='Player not found. Refresh the page.';return;}
    const status=$('#ast').value, teamId=status==='Sold'?$('#team').value:null;
    const price=status==='Sold'?Number($('#price').value):null;
    const issue=validate(p,status,teamId,price);
    if(issue){$('#msg').textContent=issue;return;}
    const team=cachedTeams.find(t=>t.team_id===teamId);
    pending={session,p,status,teamId,price,team};
    $('#confirmDetails').innerHTML=`<dl><dt>Player</dt><dd>${p.player_id} · ${p.player_name}</dd><dt>Status</dt><dd>${status}</dd><dt>Team</dt><dd>${team?.team_name||'Not allocated'}</dd><dt>Price</dt><dd>${price==null?'—':money(price)}</dd></dl>`;
    $('#confirmWarning').textContent=status==='Sold'?'This will immediately update every connected screen.':'';
    $('#confirmSale').showModal();
  }
  async function confirmSave(e){
    e.preventDefault(); if(!pending)return;
    const {session,p,status,teamId,price}=pending;
    const update={auction_status:status,team_id:teamId,sold_price:price};
    const {error}=await db.from('players').update(update).eq('player_id',p.player_id);
    if(error){$('#msg').textContent=error.message;$('#confirmSale').close();return;}
    await db.from('auction_log').insert({player_id:p.player_id,old_status:p.auction_status,new_status:status,old_team_id:p.team_id,new_team_id:teamId,old_price:p.sold_price,new_price:price,changed_by:session.user.email});
    $('#msg').textContent=`${p.player_name} updated centrally.`;
    $('#confirmSale').close(); pending=null; await fetchAll();
  }
  window.addEventListener('DOMContentLoaded',()=>{
    const save=$('#save'); if(save)save.onclick=prepareSave;
    $('#setCurrent')?.addEventListener('click',setCurrent);
    $('#refreshLog')?.addEventListener('click',renderLog);
    $('#confirmSave')?.addEventListener('click',confirmSave);
    fetchAll();
    db.channel('fcpl-auction-state').on('postgres_changes',{event:'*',schema:'public',table:'auction_state'},fetchAll).subscribe();
    db.channel('fcpl-auction-log').on('postgres_changes',{event:'*',schema:'public',table:'auction_log'},renderLog).subscribe();
    db.channel('fcpl-summary').on('postgres_changes',{event:'*',schema:'public',table:'players'},fetchAll).subscribe();
  });
})();
