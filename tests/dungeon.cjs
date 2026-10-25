// 用 Playwright 运行：node tests/dungeon.cjs；先在项目目录启动 8765 静态服务。
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const page=await browser.newPage({viewport:{width:1100,height:760}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:8765/');
 await page.locator('#play').click();await page.waitForFunction(()=>Paint.state==='playing');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>Paint.state==='paused');
 const results=await page.evaluate(()=>{
  const P=Paint,results=[];function ok(condition,message){if(!condition)throw Error(message);results.push(message);}
  P.state='paused';
  ok(P.levels.node==='r1'&&P.monsters.remaining()===3,'Initial room has three skeletons');
  ok(P.player.mesh.visible&&P.cameraMode==='TPS','Third-person camera preserved');
  // 子弹必须实际命中模型，不使用清怪调试代替射击验证。
  const e=P.monsters.list[0];e.mesh.position.set(.65,0,5);e.mesh.updateMatrixWorld(true);P.player.camera(P.camera);P.state='playing';P.combat.shoot();P.state='paused';
  ok(e.health===50,'Rifle ray damages skeleton by 25');
  P.combat.reload();P.combat.update(2,false);ok(P.combat.ammo===30&&P.combat.reserve===239,'Reload consumes reserve');
  // 三种怪的准备动作与攻击分别验证。
  for(const type of ['skeleton','archer','mage']){
   P.monsters.clear();P.attacks.clear();P.player.position.set(0,0,10);P.player.health=100;
   const enemy=P.monsters.spawn(type,0,type==='skeleton'?9:4);enemy.cooldown=0;
   P.monsters.update(.01);ok(enemy.windup>0,type+' windup begins');
   P.monsters.update(Paint.config.monsters[type].windup+.01);
   if(type==='skeleton')ok(P.player.health<100,'Melee damages player');
   else {ok(P.attacks.projectiles.length===1,type+' fires projectile');for(let i=0;i<120;i++)P.attacks.update(.02);ok(P.player.health<100,type+' projectile damages player');}
  }
  // 掩体同时挡住玩家射线与敌方箭矢。
  P.monsters.clear();P.attacks.clear();P.player.position.set(0,0,10);
  const behind=P.monsters.spawn('archer',.65,4);behind.mesh.updateMatrixWorld(true);
  P.room.box(0,1.5,7,4,3,1,0xaaaaaa);P.player.camera(P.camera);const hp=behind.health;
  P.state='playing';P.combat.shoot();P.state='paused';ok(behind.health===hp,'Cover blocks rifle damage');
  P.player.health=100;P.attacks.fire(behind,new I(0,1.1,4),new I(0,1.1,10));
  for(let i=0;i<120;i++)P.attacks.update(.02);ok(P.player.health===100,'Cover blocks enemy projectile damage');
  P.player.reset();P.combat.reset();P.levels.reset();
  // 遍历全部主线门：房间清空才开门，通道无怪，前进后不再有主线后门。
  let rooms=0;
  for(let stage=0;stage<4;stage++)for(let room=1;room<=4;room++){
   ok(P.levels.stage===stage&&P.levels.node==='r'+room,'Entered '+(stage+1)+' stage room '+room);rooms++;
   ok(!P.room.unlocked&&P.monsters.remaining()>0,'Combat entrance locks exits');
   ok(!P.room.doors.some(d=>d.side==='south'),'No backward main door');
   for(const enemy of P.monsters.list)P.monsters.damage(enemy,enemy.health);P.levels.checkClear();ok(P.room.unlocked,'Clear unlocks gates');
   P.player.position.set(0,0,-12.1);P.levels.update();
   if(stage===3&&room===4){ok(P.state==='complete','Final king room completes chapter');break;}
   ok(P.levels.corridor&&P.monsters.remaining()===0,'Safe passage has no enemies');P.player.position.z=-5.1;P.levels.update();
  }
  ok(rooms===16,'All sixteen main rooms traversed');
  // 支线可来回；已清空的房间 2 不重复刷怪。
  P.player.reset();P.levels.reset();P.levels.enter('r2');for(const enemy of P.monsters.list)P.monsters.damage(enemy,enemy.health);P.levels.checkClear();
  P.levels.travel('eventA');P.player.position.z=-5.1;P.levels.update();ok(P.levels.node==='eventA'&&P.room.unlocked,'Optional event A opens without combat');
  P.levels.travel('eventB');P.player.position.z=-5.1;P.levels.update();ok(P.levels.node==='eventB','Event A connects to B');
  P.levels.travel('r2');P.player.position.z=-5.1;P.levels.update();ok(P.levels.node==='r2'&&P.monsters.remaining()===0,'Branch returns to cleared room 2');
  // 三种事件均可用，奖励不可无限重复领取。
  P.levels.enter('eventA');P.levels.event.type='shop';P.player.coins=500;const coins=P.player.coins;ok(P.levels.buy('ammo')&&P.player.coins===coins-30,'Shop charges credits');ok(!P.levels.buy('ammo'),'Shop item cannot be bought twice');
  P.levels.event.purchased=[];P.levels.event.type='trainer';ok(P.levels.buy('damage')&&P.player.buffs.includes('damage'),'Trainer grants run buff');ok(!P.levels.buy('damage'),'Trainer rejects duplicate buff');
  P.levels.event.type='altar';P.levels.event.used=false;P.player.position.set(0,0,0);P.levels.interact();ok(P.monsters.remaining()>=4&&!P.room.unlocked,'Altar pickup spawns ambush and locks gates');
  const count=P.monsters.remaining();P.levels.interact();ok(P.monsters.remaining()===count,'Altar cannot spawn repeat rewards');
  // BOSS 技能：固定落点、完整预警、极高伤害、成功躲避、阶段与召唤上限。
  P.levels.stage=3;P.levels.enter('r4');const king=P.monsters.list.find(e=>e.boss);ok(!!king,'Skeleton King spawns only at 1-4 final room');
  king.boss.smash=0;king.boss.summon=0;P.player.position.set(0,0,6);P.boss.update(king,.01);
  ok(P.attacks.hazards.length===1&&P.monsters.remaining()===3,'King summons skeletons and skull warning');
  const h=P.attacks.hazards[0],point=h.position.clone();P.player.health=100;P.attacks.update(1.49);ok(P.player.health===100&&!h.hit,'No skull damage before warning ends');
  P.attacks.update(.5);ok(P.player.health===20,'Skull impact deals 80 damage');
  P.attacks.clear();P.player.health=100;P.attacks.skull(point);P.player.position.set(-8,0,8);P.attacks.update(2);ok(P.player.health===100,'Leaving fixed red circle avoids impact');
  P.attacks.clear();king.health=king.maxHealth*.2;king.boss.smash=0;king.boss.summon=0;P.boss.update(king,.01);ok(king.boss.phase===2&&P.attacks.hazards.length===3,'Low-health king drops three skulls');
  for(let i=0;i<10;i++){king.boss.summon=0;P.boss.update(king,.01);}ok(P.monsters.remaining()<=P.config.boss.minionLimit+1,'Summons respect live minion limit');
  P.monsters.damage(king,king.health);ok(P.attacks.hazards.length===0,'Killing boss clears pending skull attacks');
  P.attacks.clear();P.state='playing';P.player.health=0;return results;
 });
 await page.waitForFunction(()=>Paint.state==='defeat');assert(await page.locator('#overlay').isVisible());
 await page.locator('#play').click();await page.waitForFunction(()=>Paint.state==='playing'&&Paint.levels.node==='r1'&&Paint.levels.stage===0);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>Paint.state==='paused');
 const paused=await page.evaluate(()=>{Paint.attacks.skull(new I(0,0,0));return Paint.attacks.hazards[0].age;});
 await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>Paint.attacks.hazards[0].age),paused);
 await page.evaluate(()=>{Paint.attacks.clear();Paint.levels.enter('eventA');Paint.levels.event.type='shop';Paint.levels.event.purchased=[];Paint.player.position.set(0,0,0);Paint.player.coins=500;Paint.state='playing';Paint.ui.panel();});
 await page.keyboard.press('KeyE');await page.waitForFunction(()=>Paint.state==='event');assert(await page.locator('#eventPanel').isVisible());
 assert.equal(await page.locator('#eventItems button').count(),4);
 await page.getByRole('button',{name:'备弹 +150 · 30',exact:true}).click();assert.equal(await page.evaluate(()=>Paint.player.coins),470);
 await page.locator('#eventClose').click();await page.waitForFunction(()=>Paint.state==='playing');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>Paint.state==='paused');
 await page.locator('#language').selectOption('1');assert.equal(await page.title(),'Paint Stick: Dungeon Trial');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({checks:results.length+9,results,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
