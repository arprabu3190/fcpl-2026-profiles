(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const cfg = window.FCPL_CONFIG;
  const db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey);
  let players = [], teams = [], current = 0, session = null, realtimeChannel = null;

  const band = a => Number(a) <= 25 ? 'Young Talent' : Number(a) <= 30 ? 'Prime' : Number(a) <= 39 ? 'Experienced' : Number(a) <= 44 ? 'Seasoned' : 'Veteran';
  const initials = n => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  const teamById = id => teams.find(t => t.team_id === id);
  const banner = document.createElement('div'); banner.className = 'connection-banner loading'; banner.textContent = 'Connecting…'; document.body.appendChild(banner);
  function connection(text, cls=''){ banner.textContent=text; banner.className='connection-banner '+cls; }
  function safe(v, fallback='—'){ return v === null || v === undefined || v === '' ? fallback : String(v); }
  function stamp(p){ const st=p.auction_status; return st==='Sold'?'<div class="stamp">SOLD</div>':st==='Unsold'?'<div class="stamp unsold">UNSOLD</div>':st==='Withdrawn'?'<div class="stamp unsold">WITHDRAWN</div>':''; }
  function photo(p){ const url=p.photo_url||''; return `<div class="photo-box">${url?`<img class="player-photo" src="${url}" alt="${p.player_name}" onerror="this.remove();this.parentElement.insertAdjacentHTML('afterbegin','<div class=&quot;fallback&quot;>${initials(p.player_name)}</div>')">`:`<div class="fallback">${initials(p.player_name)}</div>`}${stamp(p)}</div>`; }
  function allocation(p){
    const st=p.auction_status||'Available';
    if(st==='Sold'){
      const t=teamById(p.team_id);
      return `<div class="allocation sold ${t&&t.logo_url?'':'no-logo'}">${t&&t.logo_url?`<img class="team-logo" src="${t.logo_url}" alt="${t.team_name} logo">`:''}<div class="sold-copy"><small>SOLD TO</small><strong>${t?safe(t.team_name):'TEAM NOT SET'}</strong>${p.sold_price!==null&&p.sold_price!==''?`<em>Sold price: ₹${Number(p.sold_price).toLocaleString('en-IN')}</em>`:''}</div></div>`;
    }
    if(st==='Available') return '<div class="allocation">AVAILABLE FOR AUCTION</div>';
    return `<div class="allocation unsold">${st.toUpperCase()}</div>`;
  }
  function profile(p){ return `<article class="profile"><div class="hero">${photo(p)}<div class="copy"><small>FCPL 2026 · PLAYER ${p.player_id}</small><h1>${p.player_name}</h1><div class="pills"><span class="pill">${safe(p.primary_role)}</span><span class="pill">${band(p.age)}</span></div></div></div><div class="lower"><div class="stats"><div class="stat"><small>Player Category</small><b>${band(p.age)}</b></div><div class="stat"><small>Phase</small><b>${safe(p.phase)}</b></div><div class="stat"><small>Experience</small><b>${safe(p.experience)}</b></div><div class="stat"><small>Batting</small><b>${safe(p.batting_style)}</b></div><div class="stat"><small>Bowling</small><b>${safe(p.bowling_style)}</b></div><div class="stat"><small>Previous Tournament</small><b>${safe(p.previous_tournament)}</b></div></div>${allocation(p)}</div></article>`; }
  function renderProfile(){ if(!players.length){ $('#profile').innerHTML='<div class="loading-panel">No players found.</div>'; return; } current=Math.max(0,Math.min(current,players.length-1)); const p=players[current]; $('#pick').value=p.player_id; $('#profile').innerHTML=profile(p); $('#count').textContent=`PLAYER ${String(current+1).padStart(2,'0')} OF ${players.length}`; }
  function renderGrid(){ const q=$('#search').value.toLowerCase(),r=$('#role').value,s=$('#filterStatus').value; $('#grid').innerHTML=players.filter(p=>(!q||p.player_name.toLowerCase().includes(q)||p.player_id.toLowerCase().includes(q))&&(!r||p.primary_role===r)&&(!s||p.auction_status===s)).map(p=>`<article class="card" data-id="${p.player_id}">${photo(p)}<div class="card-info"><span class="badge">${p.auction_status||'Available'}</span><h3>${p.player_name}</h3><small>${p.player_id} · ${safe(p.primary_role)} · ${band(p.age)}</small></div></article>`).join('')||'<p>No players match the filters.</p>'; $$('.card').forEach(x=>x.onclick=()=>{ current=players.findIndex(p=>p.player_id===x.dataset.id); openView('showcase'); renderProfile(); }); }
  function openView(id){ $$('.view,nav button').forEach(x=>x.classList.remove('active')); $('#'+id).classList.add('active'); const b=$(`nav button[data-view="${id}"]`); if(b)b.classList.add('active'); }
  function fillSelectors(){ const picked=$('#pick').value, adminPicked=$('#ap').value; $('#pick').innerHTML=''; $('#ap').innerHTML=''; players.forEach(p=>{ $('#pick').add(new Option(`${p.player_id} - ${p.player_name}`,p.player_id)); $('#ap').add(new Option(`${p.player_id} - ${p.player_name}`,p.player_id)); }); const roles=[...new Set(players.map(p=>p.primary_role).filter(Boolean))].sort(); $('#role').innerHTML='<option value="">All roles</option>'; roles.forEach(x=>$('#role').add(new Option(x,x))); $('#team').innerHTML='<option value="">Select team</option>'; teams.forEach(t=>$('#team').add(new Option(t.team_name,t.team_id))); if(players.some(p=>p.player_id===picked)) $('#pick').value=picked; if(players.some(p=>p.player_id===adminPicked)) $('#ap').value=adminPicked; }
  function toggleSold(){ const sold=$('#ast').value==='Sold'; $('#teamWrap').classList.toggle('hidden',!sold); $('#priceWrap').classList.toggle('hidden',!sold); }
  function loadAdmin(){ if(!players.length)return; const p=players.find(x=>x.player_id===$('#ap').value)||players[0]; $('#ast').value=p.auction_status||'Available'; $('#team').value=p.team_id||''; $('#price').value=p.sold_price??''; toggleSold(); }
  function authUI(){ const signed=!!session; $('#loginPanel').classList.toggle('hidden',signed); $('#adminPanel').classList.toggle('hidden',!signed); if(signed) loadAdmin(); }
  async function loadData(keepId){ connection('Syncing…','loading'); const [{data:p,error:pe},{data:t,error:te}]=await Promise.all([db.from('players').select('*').order('player_id'),db.from('teams').select('*').order('team_name')]); if(pe||te){ console.error(pe||te); connection('Database error','offline'); $('#profile').innerHTML='<div class="loading-panel">Unable to load centralized player data.</div>'; return; } players=p||[]; teams=t||[]; if(keepId){ const i=players.findIndex(x=>x.player_id===keepId); if(i>=0)current=i; } fillSelectors(); renderProfile(); renderGrid(); loadAdmin(); connection('Live',''); }
  function subscribe(){ if(realtimeChannel) db.removeChannel(realtimeChannel); realtimeChannel=db.channel('fcpl-players-live').on('postgres_changes',{event:'*',schema:'public',table:'players'},payload=>{ const id=payload.new?.player_id||payload.old?.player_id||players[current]?.player_id; loadData(id); }).subscribe(status=>{ if(status==='SUBSCRIBED')connection('Live',''); else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')connection('Reconnect needed','offline'); }); }

  $$('nav button').forEach(b=>b.onclick=()=>openView(b.dataset.view));
  $('#prev').onclick=()=>{ if(players.length){current=(current-1+players.length)%players.length;renderProfile();} };
  $('#next').onclick=()=>{ if(players.length){current=(current+1)%players.length;renderProfile();} };
  $('#pick').onchange=e=>{current=players.findIndex(p=>p.player_id===e.target.value);renderProfile();};
  ['search','role','filterStatus'].forEach(id=>$('#'+id).oninput=renderGrid);
  $('#ap').onchange=loadAdmin; $('#ast').onchange=toggleSold;
  $('#login').onclick=async()=>{ $('#loginMessage').textContent='Signing in…'; const {data,error}=await db.auth.signInWithPassword({email:$('#loginEmail').value.trim(),password:$('#loginPassword').value}); if(error){$('#loginMessage').textContent=error.message;return;} session=data.session; $('#loginPassword').value=''; $('#loginMessage').textContent=''; authUI(); };
  $('#logout').onclick=async()=>{await db.auth.signOut();session=null;authUI();openView('showcase');};
  $('#save').onclick=async()=>{ const p=players.find(x=>x.player_id===$('#ap').value),st=$('#ast').value,tid=$('#team').value,price=$('#price').value; if(!session){$('#msg').textContent='Please sign in again.';return;} if(st==='Sold'&&!tid){$('#msg').textContent='Select a team.';return;} $('#msg').className='';$('#msg').textContent='Saving…'; const update={auction_status:st,team_id:st==='Sold'?tid:null,sold_price:st==='Sold'&&price!==''?Number(price):null}; const {error}=await db.from('players').update(update).eq('player_id',p.player_id); if(error){$('#msg').textContent=error.message;return;} $('#msg').className='success';$('#msg').textContent=`${p.player_name} updated centrally.`; };
  $('#fs').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
  window.addEventListener('online',()=>{connection('Reconnecting…','loading');loadData(players[current]?.player_id);subscribe();}); window.addEventListener('offline',()=>connection('Offline','offline'));

  (async()=>{ $('#profile').innerHTML='<div class="loading-panel"><div><div class="spinner"></div>Loading centralized player data…</div></div>'; const {data}=await db.auth.getSession(); session=data.session; authUI(); await loadData(); subscribe(); db.auth.onAuthStateChange((_event,newSession)=>{session=newSession;authUI();}); })();
})();
