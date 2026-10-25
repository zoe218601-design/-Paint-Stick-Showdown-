// 敌方弹道使用逐段碰撞，低帧率下也不会穿过角色或墙。
Paint.attacks={projectiles:[],hazards:[],
 fire(enemy,origin,target){
  if(this.projectiles.length>=Paint.config.limits.projectiles)return;
  const mage=enemy.type==='mage',mesh=new $e(mage?new Pn(.22,10,8):new mi(.06,.06,.7),new $n({color:mage?0xad73ec:0xf2c36c}));
  mesh.position.copy(origin);mesh.lookAt(target);Paint.scene.add(mesh);
  this.projectiles.push({mesh,velocity:target.clone().sub(origin).normalize().multiplyScalar(Paint.config.monsters[enemy.type].projectileSpeed),damage:enemy.damage,radius:mage?.22:.08,age:0});
 },
 skull(position){
  if(this.hazards.length>=Paint.config.limits.hazards)return;
  const c=Paint.config.boss,group=new ri();
  const marker=new $e(new Hs(c.radius,48),new $n({color:0xff2727,transparent:true,opacity:.35,side:cn,depthWrite:false}));marker.rotation.x=-Math.PI/2;marker.position.copy(position);marker.position.y=.035;Paint.scene.add(marker);
  const ring=new $e(new Go(c.radius,.06,6,48),new $n({color:0xff3838}));ring.rotation.x=-Math.PI/2;ring.position.copy(marker.position);Paint.scene.add(ring);
  const bone=new Wr({color:0xf3e0b6,roughness:.8}),dark=new $n({color:0x4e3542});
  const head=new $e(new Pn(1.5,16,12),bone);head.scale.set(1,1,.8);group.add(head);
  for(const x of [-.55,.55]){const eye=new $e(new Pn(.35,10,8),dark);eye.position.set(x,.2,-1.05);group.add(eye);}
  for(let x=-.8;x<=.8;x+=.4){const tooth=new $e(new mi(.25,.5,.3),bone);tooth.position.set(x,-1.2,-.6);group.add(tooth);}
  group.position.copy(position);group.position.y=c.height;Paint.scene.add(group);
  this.hazards.push({marker,ring,mesh:group,position:position.clone(),age:0,hit:false});
 },
 removeObject(mesh){Paint.scene.remove(mesh);mesh.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});},
 update(dt){const p=Paint.player,c=Paint.config.boss;
  for(let i=this.projectiles.length-1;i>=0;i--){const shot=this.projectiles[i],from=shot.mesh.position.clone(),to=from.clone().addScaledVector(shot.velocity,dt);shot.age+=dt;
   const segment=to.clone().sub(from),center=p.position.clone().add(new I(0,1,0)),fraction=Br.clamp(center.clone().sub(from).dot(segment)/(segment.lengthSq()||1),0,1);
   const hit=from.clone().addScaledVector(segment,fraction).distanceTo(center)<.65+shot.radius,blocked=Paint.room.blocked(from,to);
   if(hit&&!blocked)p.health=Math.max(0,p.health-shot.damage);
   shot.mesh.position.copy(to);if(hit||blocked||shot.age>6){this.removeObject(shot.mesh);this.projectiles.splice(i,1);}
  }
  for(let i=this.hazards.length-1;i>=0;i--){const h=this.hazards[i];h.age+=dt;const fall=Br.clamp((h.age-c.warning)/c.fall,0,1);
   h.mesh.position.y=c.height*(1-fall)+1.4;h.marker.material.opacity=.25+Math.sin(h.age*15)*.12;h.ring.scale.setScalar(.95+Math.sin(h.age*10)*.05);
   if(!h.hit&&fall===1){h.hit=true;const distance=Math.hypot(p.position.x-h.position.x,p.position.z-h.position.z);
    // 空中跳跃也不能免疫巨型砸击；必须离开红色范围。
    if(distance<c.radius+Paint.config.player.radius)p.health=Math.max(0,p.health-c.damage);
    Paint.effects.burst(h.position.clone().add(new I(0,.5,0)),0xffb26b);
   }
   if(h.age>c.warning+c.fall+c.impactDuration){for(const mesh of [h.marker,h.ring,h.mesh])this.removeObject(mesh);this.hazards.splice(i,1);}
  }
 },
 clearBoss(){for(const h of this.hazards)for(const mesh of [h.marker,h.ring,h.mesh])this.removeObject(mesh);this.hazards=[];},
 clear(){this.clearBoss();for(const shot of this.projectiles)this.removeObject(shot.mesh);this.projectiles=[];}
};
