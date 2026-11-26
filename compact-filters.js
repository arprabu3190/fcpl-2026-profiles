(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const ids = ['role','categoryFilter','phaseFilter','experienceFilter','playerTeamFilter'];
  const filterCount = () => ids.reduce((n,id)=>n+($('#'+id)?.value?1:0),0)+($('#status')?.value?1:0);
  function sync(){
    const n=filterCount();
    $('#filterCount').textContent=n;
    $('#filterCount').classList.toggle('zero',n===0);
    $('#appliedFilterText').textContent=`${n} filter${n===1?'':'s'} applied`;
      $('#resetFilters')?.classList.toggle('noActiveFilters',n===0&&!$('#search')?.value);
    $$('[data-status-chip]').forEach(b=>b.classList.toggle('active',b.dataset.statusChip===$('#status').value));
  }
  function setStatus(v){$('#status').value=v;$('#status').dispatchEvent(new Event('input',{bubbles:true}));sync()}
  $$('[data-status-chip]').forEach(b=>b.onclick=()=>setStatus(b.dataset.statusChip));
  $('#openFilters').onclick=()=>{
    if(matchMedia('(max-width:900px)').matches) openSheet();
    else $('#advancedFilterPanel').classList.toggle('collapsed');
  };
  $('#clearSearch').onclick=()=>{$('#search').value='';$('#search').dispatchEvent(new Event('input',{bubbles:true}))};
  function reset(){
    ids.forEach(id=>$('#'+id).value='');$('#status').value='';$('#sortPlayers').value='id';
    $('#search').value='';['role','categoryFilter','phaseFilter','experienceFilter','playerTeamFilter','status','sortPlayers','search'].forEach(id=>$('#'+id)?.dispatchEvent(new Event('input',{bubbles:true})));sync();
  }
  $('#resetFilters').onclick=reset;
  function openSheet(){
    const host=$('#mobileFilterFields');host.innerHTML='';
    ids.forEach(id=>{const source=$('#'+id);const label=source.closest('label')?.firstChild?.textContent?.trim()||id;const wrap=document.createElement('label');wrap.textContent=label;const clone=source.cloneNode(true);clone.id='mobile-'+id;clone.value=source.value;wrap.appendChild(clone);host.appendChild(wrap)});
    $('#mobileApply').textContent=`Show ${$('#playerResultCount').textContent}`;
    $('#mobileFilterSheet').showModal();
  }
  $('#mobileApply').onclick=e=>{e.preventDefault();ids.forEach(id=>{const m=$('#mobile-'+id);if(m)$('#'+id).value=m.value});ids.forEach(id=>$('#'+id).dispatchEvent(new Event('input',{bubbles:true})));sync();$('#mobileFilterSheet').close()};
  $('#mobileReset').onclick=()=>{
      reset();
      ids.forEach(id=>{const m=$('#mobile-'+id);if(m)m.value=''});
      $('#mobileApply').textContent=`Show ${$('#playerResultCount').textContent}`;
    };
  $('#closeFilterSheet').onclick=()=>$('#mobileFilterSheet').close();
  ids.concat(['status']).forEach(id=>$('#'+id)?.addEventListener('input',sync));
  new MutationObserver(sync).observe($('#activeFilters'),{childList:true,subtree:true});sync();
})();
