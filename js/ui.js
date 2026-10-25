Paint.ui={notice:'',
 init(){
  document.querySelector('#language').onchange=e=>{Paint.language=Number(e.target.value);this.translate();};
  document.querySelector('#play').onclick=()=>Paint.state==='paused'?Paint.resume():Paint.start();
  document.querySelector('#eventClose').onclick=()=>Paint.resume();
  document.querySelector('#pause').onclick=()=>Paint.state==='event'?Paint.resume():Paint.pause();this.translate();
 },
 translate(){document.documentElement.lang=['zh-CN','en','zh-TW'][Paint.language];document.title=Paint.t('title');
  for(const el of document.querySelectorAll('[data-text]'))el.textContent=Paint.t(el.dataset.text);this.panel();this.update();
 },
 panel(){const state=Paint.state||'menu';document.querySelector('#overlay').hidden=state==='playing'||state==='event';
  document.querySelector('#eventPanel').hidden=state!=='event';if(state==='event')this.eventPanel();
  document.querySelector('#heading').textContent=Paint.t({menu:'title',paused:'pause',defeat:'defeat',complete:'complete'}[state]||'title');
  document.querySelector('#description').textContent=Paint.t(state==='complete'?'completeText':'intro');
  document.querySelector('#play').textContent=Paint.t(state==='paused'?'resume':state==='menu'?'start':'retry');
  document.querySelector('#summary').textContent=['defeat','complete'].includes(state)?`${Paint.config.stages[Paint.levels.stage].id} · ${Paint.t('kills')} ${Paint.player.kills} · ${Paint.t('coins')} ${Paint.player.coins}`:'';
 },
 eventPanel(){const event=Paint.levels.event;if(!event)return;document.querySelector('#eventTitle').textContent=Paint.t(event.type);
  document.querySelector('#eventCoins').textContent=`${Paint.t('coins')} ${Paint.player.coins} · ${Paint.t('buffs')} ${Paint.player.buffs.length}/3`;
  const root=document.querySelector('#eventItems');root.replaceChildren();const trainer=event.type==='trainer',config=Paint.config.events;
  for(const item of trainer?config.buffs:event.goods){const bought=event.purchased.includes(item.id)||(trainer&&Paint.player.buffs.includes(item.id)),price=Math.round(item.price*(trainer?1+Paint.player.buffs.length*config.priceGrowth:1));
   const button=document.createElement('button'),key={ammo:'ammoItem',health:'healthBuff',reload:'reloadBuff'}[item.id]||item.id;
   button.textContent=`${Paint.t(key)} · ${bought?Paint.t('bought'):price}`;
   button.disabled=bought||Paint.player.coins<price||(trainer&&Paint.player.buffs.length>=config.maxBuffs);
   button.onclick=()=>{this.notice=Paint.levels.buy(item.id)?'bought':'notEnough';this.eventPanel();};root.append(button);
  }
 },
 update(){if(!Paint.player.mesh||!Paint.levels)return;const p=Paint.player,c=Paint.combat,l=Paint.levels;
  document.querySelector('#health').textContent=Math.ceil(p.health)+' / '+p.maxHealth;
  document.querySelector('#healthFill').style.width=p.health/p.maxHealth*100+'%';
  document.querySelector('#coins').textContent=p.coins;document.querySelector('#enemies').textContent=Paint.monsters.remaining();
  document.querySelector('#ammo').textContent=c.reloadTime>0?Paint.t('reload'):`${c.ammo} / ${c.reserve}`;
  document.querySelector('#roomLabel').textContent=`${Paint.config.stages[l.stage].id} · ${l.corridor?Paint.t('passage'):l.event?Paint.t(l.event.type):Paint.t('mainRoom')+' '+l.node.slice(1)+'/4'}`;
  let objective=Paint.t(Paint.room.unlocked?'open':'locked');
  if(l.corridor)objective=Paint.t('passage');else if(l.event)objective=Paint.t(Paint.monsters.remaining()?'altarTaken':l.event.type==='altar'?l.event.used?'used':'altarHint':'eventHint');
  else if(l.node==='r2'&&Paint.room.unlocked)objective+=' · '+Paint.t('branchRoute');
  else if(l.node==='r3'&&Paint.room.unlocked)objective+=' · '+Paint.t('extra');
  document.querySelector('#objective').textContent=objective;
  const boss=Paint.monsters.list.find(e=>e.boss&&e.health>0),panel=document.querySelector('#bossHud');panel.hidden=!boss;
  if(boss){document.querySelector('#bossName').textContent=`${Paint.t('boss')} · ${Paint.t('phase')} ${boss.boss.phase+1}`;document.querySelector('#bossFill').style.width=boss.health/boss.maxHealth*100+'%';}
  document.querySelector('#danger').hidden=Paint.attacks.hazards.length===0;document.querySelector('#danger').textContent=Paint.t('warning');
 }
};
