Paint.ui={
 init(){
  document.querySelector('#language').onchange=e=>{Paint.language=Number(e.target.value);this.translate();};
  document.querySelector('#play').onclick=()=>Paint.state==='paused'?Paint.resume():Paint.start();
  document.querySelector('#pause').onclick=()=>Paint.pause();this.translate();
 },
 translate(){document.documentElement.lang=['zh-CN','en','zh-TW'][Paint.language];document.title=Paint.t('title');
  for(const el of document.querySelectorAll('[data-text]'))el.textContent=Paint.t(el.dataset.text);
  this.panel();this.update();
 },
 panel(){const state=Paint.state||'menu',overlay=document.querySelector('#overlay');overlay.hidden=state==='playing';
  document.querySelector('#heading').textContent=Paint.t({menu:'title',paused:'pause',defeat:'defeat',complete:'complete'}[state]||'title');
  document.querySelector('#description').textContent=Paint.t(state==='complete'?'completeText':'intro');
  document.querySelector('#play').textContent=Paint.t(state==='paused'?'resume':state==='menu'?'start':'retry');
  document.querySelector('#summary').textContent=['defeat','complete'].includes(state)?`${Paint.t('kills')} ${Paint.player.kills} · ${Paint.t('coins')} ${Paint.player.coins}`:'';
 },
 update(){if(!Paint.player.mesh)return;const p=Paint.player,c=Paint.combat;
  document.querySelector('#health').textContent=Math.ceil(p.health);
  document.querySelector('#healthFill').style.width=p.health/Paint.config.player.health*100+'%';
  document.querySelector('#coins').textContent=p.coins;document.querySelector('#enemies').textContent=Paint.monsters.remaining();
  document.querySelector('#ammo').textContent=c.reloadTime>0?Paint.t('reload'):`${c.ammo} / ${c.reserve}`;
  document.querySelector('#objective').textContent=Paint.t(Paint.room.unlocked?'open':'locked');
 }
};
