Paint.player = {
 create(scene){
  const group=new ri(), material=new Wr({color:0x3289df,roughness:.8});
  const piece=(geo,x,y,z)=>{const m=new $e(geo,material);m.position.set(x,y,z);m.castShadow=true;group.add(m);return m;};
  piece(new Pn(.25,12,10),0,1.6,0);piece(new mr(.17,.19,.65,10),0,1.05,0);
  for(const x of [-.2,.2]){piece(new mr(.07,.07,.65,8),x,.4,0);piece(new mr(.07,.07,.55,8),x*1.6,1.1,-.1);}
  const gun=Paint.makeWeapon('rifle',material);gun.scale.setScalar(.5);gun.position.set(.25,1.15,-.35);group.add(gun);
  scene.add(group);this.mesh=group;this.position=group.position;this.reset();
 },
 reset(){this.position.set(0,0,10);this.health=Paint.config.player.health;this.coins=0;this.kills=0;this.velocityY=0;this.yaw=0;this.pitch=0;this.aim=false;},
 update(dt,keys){
  const c=Paint.config.player;let x=Number(keys.has('KeyD'))-Number(keys.has('KeyA')),z=Number(keys.has('KeyS'))-Number(keys.has('KeyW'));
  const length=Math.hypot(x,z)||1,speed=keys.has('ShiftLeft')?c.sprint:c.speed;
  x=x/length*speed*dt;z=z/length*speed*dt;
  Paint.room.move(this.position,x*Math.cos(this.yaw)+z*Math.sin(this.yaw),z*Math.cos(this.yaw)-x*Math.sin(this.yaw));
  if(keys.has('Space')&&this.position.y===0)this.velocityY=c.jump;
  this.velocityY-=c.gravity*dt;this.position.y=Math.max(0,this.position.y+this.velocityY*dt);
  if(this.position.y===0)this.velocityY=0;this.mesh.rotation.y=this.yaw;
 },
 look(dx,dy){this.yaw-=dx*Paint.config.camera.sensitivity;this.pitch=Br.clamp(this.pitch-dy*Paint.config.camera.sensitivity,-1.2,1.2);},
 camera(camera){
  const c=Paint.config.camera,target=this.position.clone().add(new I(0,Paint.config.player.eye,0));
  camera.rotation.set(this.pitch,this.yaw,0,'YXZ');camera.position.copy(target);
  this.mesh.visible=Paint.cameraMode!=='FPS';
  if(Paint.cameraMode==='TPS'){
   const offset=new I(this.aim?c.shoulder*.6:c.shoulder,.2,this.aim?c.distance*.55:c.distance).applyQuaternion(camera.quaternion);
   // 从角色头部向相机做射线检测，墙边自动拉近，避免穿墙。
   const ray=new Wo(target,offset.clone().normalize(),0,offset.length());
   const hit=ray.intersectObjects(Paint.room.walls,false)[0];
   camera.position.addScaledVector(offset.clone().normalize(),hit?Math.max(.1,hit.distance-.25):offset.length());
  }
 }
};
