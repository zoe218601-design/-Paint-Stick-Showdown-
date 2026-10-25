// 关卡图负责前进、可选支线及通道；主线永远没有回头门。
Paint.levels={
 reset(){this.stage=0;this.node='r1';this.cleared=new Set();this.events={};this.layouts={};this.pending=null;this.corridor=false;this.enter('r1');},
 eventData(node){const key=this.stage+node;if(!this.events[key]){
  const weights=Paint.config.events.weights;let value=Math.random()*Object.values(weights).reduce((a,b)=>a+b,0),type='shop';
  for(const [id,weight] of Object.entries(weights)){value-=weight;if(value<0){type=id;break;}}
  this.events[key]={type,used:false,purchased:[],goods:[...Paint.config.events.goods].sort(()=>Math.random()-.5)};
 }return this.events[key];},
 enter(node){
  this.node=node;this.corridor=false;Paint.monsters.clear();Paint.attacks.clear();Paint.drops.reset();Paint.effects.reset();
  const isMain=node.startsWith('r'),index=isMain?Number(node.slice(1))-1:0,boss=this.stage===3&&node==='r4';
  this.event=isMain?null:this.eventData(node);
  const key=this.stage+node;if(this.layouts[key]===undefined)this.layouts[key]=Math.floor(Math.random()*Paint.config.roomTemplates.length);
  Paint.room.build(Paint.scene,{boss,event:this.event,doors:Paint.config.graph[node],templateIndex:this.layouts[key]});
  Paint.player.position.set(0,0,10);Paint.player.velocityY=0;Paint.player.yaw=0;Paint.player.pitch=0;
  if(isMain&&!this.cleared.has(this.stage+node))Paint.monsters.spawnWave(Paint.config.stages[this.stage].rooms[index]);
  Paint.combat.reloadTime=0;Paint.combat.cooldown=0;this.checkClear();Paint.ui?.update();
 },
 checkClear(){if(this.corridor)return;if(Paint.monsters.remaining()===0){
  if(this.node.startsWith('r'))this.cleared.add(this.stage+this.node);
  Paint.room.unlock();
 }},
 travel(target){
  if(this.corridor||target==='extra')return;
  if(target==='next'&&this.stage===3){Paint.finish('complete');return;}
  this.pending=target;this.corridor=true;Paint.monsters.clear();Paint.attacks.clear();Paint.drops.reset();Paint.effects.reset();
  Paint.room.build(Paint.scene,{corridor:true});Paint.player.position.set(0,0,4);Paint.player.yaw=0;Paint.player.pitch=0;Paint.player.velocityY=0;
 },
 update(){
  if(this.corridor){if(Paint.player.position.z< -5){let target=this.pending;if(target==='next'){
    this.stage++;target='r1';Paint.player.health=Math.min(Paint.player.maxHealth,Paint.player.health+Paint.config.stageSupply.health);
    Paint.combat.reserve=Math.min(Paint.config.weapon.reserveMax,Paint.combat.reserve+Paint.config.stageSupply.ammo);
   }this.enter(target);}return;}
  this.checkClear();if(!Paint.room.unlocked)return;
  const p=Paint.player.position;
  for(const door of Paint.room.doors){if(door.target==='extra')continue;
   if((door.side==='north'&&p.z< -12&&Math.abs(p.x)<.85)||(door.side==='east'&&p.x>12&&Math.abs(p.z)<.85)||(door.side==='west'&&p.x< -12&&Math.abs(p.z)<.85)){this.travel(door.target);break;}
  }
 },
 interact(){if(!this.event||this.corridor||Paint.player.position.length()>3||Paint.monsters.remaining())return;
  const event=this.event;
  if(event.type==='altar'){
   if(event.used)return;event.used=true;Paint.player.damageMultiplier=Math.max(Paint.player.damageMultiplier,Paint.config.events.altarDamageMultiplier);
   Paint.room.lock();Paint.monsters.spawnWave(Array(Paint.config.events.altarEnemies+this.stage).fill('skeleton'));Paint.ui.notice='altarTaken';
  }else Paint.openEvent();
 },
 buy(id){const event=this.event,c=Paint.config.events,p=Paint.player;if(!event)return false;
  const trainer=event.type==='trainer',record=(trainer?c.buffs:c.goods).find(x=>x.id===id);if(!record)return false;
  if(event.purchased.includes(id)||(trainer&&p.buffs.length>=c.maxBuffs)||(trainer&&p.buffs.includes(id)))return false;
  const price=Math.round(record.price*(trainer?1+p.buffs.length*c.priceGrowth:1));if(p.coins<price)return false;
  p.coins-=price;event.purchased.push(id);
  if(trainer){p.buffs.push(id);if(id==='damage')p.damageMultiplier+=record.amount;if(id==='health'){p.maxHealth+=record.amount;p.health+=record.amount;}if(id==='reload')p.reloadMultiplier*=1-record.amount;}
  else {if(id==='heal')p.health=Math.min(p.maxHealth,p.health+record.amount);if(id==='ammo')Paint.combat.reserve=Math.min(Paint.config.weapon.reserveMax,Paint.combat.reserve+record.amount);if(id==='power')p.damageMultiplier+=record.amount;if(id==='supply'){p.health=Math.min(p.maxHealth,p.health+record.amount);Paint.combat.reserve=Math.min(Paint.config.weapon.reserveMax,Paint.combat.reserve+record.amount*3);}}
  return true;
 }
};
