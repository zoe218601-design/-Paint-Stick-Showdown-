// 普通脚本按顺序加载，不使用 fetch/import，支持直接双击 index.html。
(()=>{
const P=Paint;P.state='menu';P.cameraMode=P.config.CAMERA_MODE; // 用户指定：固定第三人称过肩视角。
P.scene=new fh();P.scene.background=new Ge(0xc8d8d1);P.scene.fog=new Bo(0xc8d8d1,25,55);
const renderer=new d0({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=Pc;renderer.toneMapping=Lc;renderer.toneMappingExposure=1.3;
P.camera=new ln(P.config.camera.fov,innerWidth/innerHeight,P.config.camera.near,100);P.camera.rotation.order='YXZ';
P.scene.add(new yh(0xf4fae9,0x7b9692,2.3));const light=new bh(0xfff1cf,3);light.position.set(-8,18,8);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-18,right:18,top:18,bottom:-18});light.shadow.bias=-.001;P.scene.add(light);
P.room.build(P.scene);P.player.create(P.scene);P.monsters.create(P.scene);P.drops.create(P.scene);P.monsters.spawn();P.combat.reset();
const canvas=renderer.domElement,keys=new Set();let fire=false,drag=false;
function clearInput(){keys.clear();fire=false;drag=false;P.player.aim=false;}
canvas.tabIndex=0;
async function lock(){canvas.focus({preventScroll:true});try{await canvas.requestPointerLock?.();}catch{/* 浏览器拒绝时仍可拖动转向。 */}}
P.start=()=>{P.monsters.reset();P.drops.reset();P.effects.reset();P.player.reset();P.combat.reset();P.room.unlocked=false;P.room.gate.visible=true;P.state='playing';clearInput();P.ui.panel();lock();};
P.resume=()=>{P.state='playing';clearInput();P.ui.panel();lock();};
P.pause=()=>{if(P.state!=='playing')return;P.state='paused';clearInput();document.exitPointerLock?.();P.ui.panel();};
function finish(state){P.state=state;clearInput();document.exitPointerLock?.();P.ui.panel();}
canvas.onmousedown=e=>{if(P.state!=='playing')return;drag=true;if(e.button===0)fire=true;if(e.button===2)P.player.aim=true;if(!document.pointerLockElement)lock();};
window.addEventListener('mouseup',e=>{drag=false;if(e.button===0)fire=false;if(e.button===2)P.player.aim=false;});
window.addEventListener('mousemove',e=>{if(P.state==='playing'&&(document.pointerLockElement===canvas||drag))P.player.look(e.movementX,e.movementY);});
canvas.oncontextmenu=e=>e.preventDefault();
window.addEventListener('keydown',e=>{
 if(e.target.matches('select,input,textarea,button'))return;
 if(['Space','KeyW','KeyA','KeyS','KeyD','F2','F3','F4','F6'].includes(e.code))e.preventDefault();
 if(e.code==='Escape'){P.pause();return;}if(P.state!=='playing')return;keys.add(e.code);
 if(e.code==='KeyR')P.combat.reload();if(e.repeat)return;
 const debug=P.config.debug;
 if(e.code===debug.heal)P.player.health=P.config.player.health;
 if(e.code===debug.coins)P.player.coins+=100;
 if(e.code===debug.clear)for(const enemy of P.monsters.list)P.monsters.damage(enemy,enemy.health);
 if(e.code===debug.exit)P.room.unlock();
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',P.pause);
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement)P.pause();});
window.addEventListener('resize',resize);function resize(){renderer.setSize(innerWidth,innerHeight);P.camera.aspect=innerWidth/innerHeight;P.camera.updateProjectionMatrix();}resize();P.ui.init();
let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;
 if(P.state==='playing'){
  P.player.update(dt,keys);P.player.camera(P.camera);P.combat.update(dt,fire);P.monsters.update(dt);P.drops.update(dt);P.effects.update(dt);
  if(P.player.health<=0)finish('defeat');
  else {if(!P.monsters.remaining())P.room.unlock();if(P.room.unlocked&&P.player.position.z< -P.room.half+1&&Math.abs(P.player.position.x)<.8)finish('complete');}
 }
 P.player.camera(P.camera);P.ui.update();renderer.render(P.scene,P.camera);
}requestAnimationFrame(frame);
})();
