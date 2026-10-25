// 普通脚本按顺序加载，不使用 fetch/import，支持直接双击 index.html。
(()=>{
const P=Paint;P.state='menu';P.cameraMode=P.config.CAMERA_MODE; // 用户指定：固定第三人称过肩视角。
P.scene=new fh();P.scene.background=new Ge(0xc8d8d1);P.scene.fog=new Bo(0xc8d8d1,25,55);
const renderer=new d0({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=Pc;renderer.toneMapping=Lc;renderer.toneMappingExposure=1.3;
P.camera=new ln(P.config.camera.fov,innerWidth/innerHeight,P.config.camera.near,100);P.camera.rotation.order='YXZ';
P.scene.add(new yh(0xf4fae9,0x7b9692,2.3));const light=new bh(0xfff1cf,3);light.position.set(-8,18,8);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-18,right:18,top:18,bottom:-18});light.shadow.bias=-.001;P.scene.add(light);
P.room.build(P.scene);P.player.create(P.scene);P.monsters.create(P.scene);P.drops.create(P.scene);P.combat.reset();
const canvas=renderer.domElement,keys=new Set();let fire=false,drag=false;
function clearInput(){keys.clear();fire=false;drag=false;P.player.aim=false;}
canvas.tabIndex=0;
async function lock(){canvas.focus({preventScroll:true});try{await canvas.requestPointerLock?.();}catch{/* 浏览器拒绝时仍可拖动转向。 */}}
P.start=()=>{P.player.reset();P.combat.reset();P.levels.reset();P.state='playing';clearInput();P.ui.panel();lock();};
P.resume=()=>{P.state='playing';clearInput();P.ui.panel();lock();};
P.pause=()=>{if(P.state!=='playing')return;P.state='paused';clearInput();document.exitPointerLock?.();P.ui.panel();};
P.finish=function(state){P.state=state;P.attacks.clear();clearInput();document.exitPointerLock?.();P.ui.panel();};
P.openEvent=()=>{clearInput();P.state='event';document.exitPointerLock?.();P.ui.panel();};
canvas.onmousedown=e=>{if(P.state!=='playing')return;drag=true;if(e.button===0)fire=true;if(e.button===2)P.player.aim=true;if(!document.pointerLockElement)lock();};
window.addEventListener('mouseup',e=>{drag=false;if(e.button===0)fire=false;if(e.button===2)P.player.aim=false;});
window.addEventListener('mousemove',e=>{if(P.state==='playing'&&(document.pointerLockElement===canvas||drag))P.player.look(e.movementX,e.movementY);});
canvas.oncontextmenu=e=>e.preventDefault();
window.addEventListener('keydown',e=>{
 if(e.target.matches('select,input,textarea')||(e.target.matches('button')&&e.code!=='Escape'))return;
 if(['Space','KeyW','KeyA','KeyS','KeyD',...Object.values(P.config.debug)].includes(e.code))e.preventDefault();
 if(e.code==='Escape'){P.state==='event'?P.resume():P.pause();return;}if(P.state!=='playing')return;keys.add(e.code);
 if(e.code==='KeyR')P.combat.reload();if(e.code==='KeyE')P.levels.interact();if(e.repeat)return;
 const debug=P.config.debug;
 if(e.code===debug.heal)P.player.health=P.player.maxHealth;
 if(e.code===debug.coins)P.player.coins+=100;
 if(e.code===debug.clear)for(const enemy of P.monsters.list)P.monsters.damage(enemy,enemy.health);
 if(e.code===debug.exit)P.room.unlock();
 if(e.code===debug.next){if(P.levels.corridor)P.player.position.z=-5.5;else P.levels.travel(P.config.graph[P.levels.node].north||'r2');}
 if(e.code===debug.boss){P.levels.stage=3;P.levels.enter('r4');P.player.health=P.player.maxHealth;P.combat.reset();}
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',P.pause);
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement)P.pause();});
window.addEventListener('resize',resize);function resize(){renderer.setSize(innerWidth,innerHeight);P.camera.aspect=innerWidth/innerHeight;P.camera.updateProjectionMatrix();}resize();P.levels.reset();P.ui.init();
let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;
 if(P.state==='playing'){
  P.player.update(dt,keys);P.player.camera(P.camera);P.combat.update(dt,fire);P.monsters.update(dt);P.attacks.update(dt);P.drops.update(dt);P.effects.update(dt);
  if(P.player.health<=0)P.finish('defeat');else P.levels.update();
 }
 P.player.camera(P.camera);P.ui.update();renderer.render(P.scene,P.camera);
}requestAnimationFrame(frame);
})();
