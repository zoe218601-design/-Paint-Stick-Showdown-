// 三种骷髅共用骨架，武器、配色和攻击行为由类型配置决定。
Paint.monsters={
 create(scene){this.scene=scene;this.list=[];},
 spawn(type,x,z){
  // 召唤前回收已倒下的模型，避免长时间 BOSS 战积累隐藏对象。
  this.list=this.list.filter(e=>{if(e.health>0)return true;this.scene.remove(e.mesh);e.mesh.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return false;});
  if(this.remaining()>=Paint.config.limits.monsters)return null;
  const c=Paint.config.monsters[type],group=new ri(),mat=new Wr({color:c.color,roughness:.9}),dark=new $n({color:0x344b50});
  const part=(geo,x,y,z,material=mat)=>{const mesh=new $e(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;group.add(mesh);return mesh;};
  part(new Pn(.32,12,10),0,1.65,0);for(const x of [-.12,.12])part(new Pn(.075,8,6),x,1.7,-.275,dark);
  part(new mi(.24,.6,.2),0,1.05,0);for(const y of [.9,1.05,1.2])part(new mi(.5,.06,.25),0,y,0);
  for(const x of [-.23,.23]){part(new mr(.065,.065,.65,8),x,.4,0);part(new mr(.065,.065,.6,8),x*1.4,1.08,0);}
  if(type==='skeleton'||type==='king')part(new mi(.12,.7,.07),.4,1,-.3,new Wr({color:0xaabec3}));
  if(type==='archer'){const bow=part(new Go(.35,.04,6,16,Math.PI),.4,1.2,-.2,new Wr({color:0x936545}));bow.rotation.z=Math.PI/2;part(new mi(.02,.7,.02),.4,1.2,-.2);}
  if(type==='mage'){part(new mr(.035,.035,1.7,8),.4,1,0);part(new Pn(.16,8,8),.4,1.9,0,new $n({color:0xac76ec}));part(new ko(.4,.55,8),0,2.08,0,new Wr({color:0x81649f}));}
  if(type==='king'){group.scale.setScalar(2.3);for(const x of [-.25,0,.25])part(new ko(.09,.35,6),x,2.15,0,new Wr({color:0xffc645}));}
  group.position.set(x,0,z);this.scene.add(group);
  const difficulty=Paint.config.difficulty,stage=Paint.levels?.stage||0,room=Number(Paint.levels?.node?.slice(1))||1;
  const health=c.health*(type==='king'?1:1+stage*difficulty.healthStage+(room-1)*difficulty.healthRoom);
  const enemy={type,mesh:group,material:mat,health,maxHealth:health,damage:c.damage*(1+stage*difficulty.damageStage+(room-1)*difficulty.damageRoom),cooldown:1+Math.random(),windup:0,path:[],routeTime:0};
  if(type==='king')enemy.boss={smash:Paint.config.boss.firstSmash,summon:Paint.config.boss.firstSummon,phase:0};
  this.list.push(enemy);return enemy;
 },
 spawnWave(types){
  const positions=[[-8,-8],[7,-8],[-8,5],[8,5],[0,-10],[-10,-2],[10,-2],[-4,-10],[4,-10],[-9,8]];
  types.forEach((type,i)=>{let [x,z]=type==='king'?[0,-6]:positions[i%positions.length];
   if(!Paint.room.free(x,z,.6)){outer:for(let a=-10;a<=10;a+=2)for(let b=-10;b<=6;b+=2)if(Paint.room.free(a,b,.6)){x=a;z=b;break outer;}}
   this.spawn(type,x,z);
  });
 },
 damage(enemy,amount){if(enemy.health<=0)return;enemy.health=Math.max(0,enemy.health-amount);if(enemy.health===0){enemy.mesh.visible=false;Paint.player.kills++;Paint.drops.spawn(enemy.mesh.position,Paint.config.monsters[enemy.type].coins);Paint.effects.burst(enemy.mesh.position.clone().add(new I(0,1,0)),0xf2e8ca);
   if(enemy.boss)Paint.attacks.clearBoss();
  }
 },
 move(enemy,target,dt,speed){
  enemy.routeTime-=dt;if(enemy.routeTime<=0){enemy.path=Paint.room.path(enemy.mesh.position,target);enemy.routeTime=.8+Math.random()*.3;}
  while(enemy.path.length&&enemy.mesh.position.distanceTo(enemy.path[0])<.4)enemy.path.shift();
  const d=(enemy.path[0]||target).clone().sub(enemy.mesh.position);d.y=0;d.normalize();Paint.room.move(enemy.mesh.position,d.x*speed*dt,d.z*speed*dt);
 },
 update(dt){const p=Paint.player;
  // 使用快照，召唤物从下一帧开始行动，不在本次循环中再次召唤。
  for(const enemy of [...this.list]){if(enemy.health<=0)continue;const c=Paint.config.monsters[enemy.type],d=p.position.clone().sub(enemy.mesh.position);d.y=0;const distance=d.length();
   enemy.mesh.rotation.y=Math.atan2(-d.x,-d.z);enemy.cooldown-=dt;
   const origin=enemy.mesh.position.clone().add(new I(0,enemy.boss?3:1.3,0)),target=p.position.clone().add(new I(0,1.1,0));
   const visible=!Paint.room.blocked(origin,target);
   if(enemy.boss)Paint.boss.update(enemy,dt);
   if(enemy.windup>0){enemy.windup=Math.max(0,enemy.windup-dt);enemy.material.emissive.setHex(0x6b2424);
    if(enemy.windup===0){enemy.material.emissive.setHex(0);enemy.cooldown=c.interval;
     if(enemy.type==='archer'||enemy.type==='mage')Paint.attacks.fire(enemy,origin,enemy.aimTarget);
     else if(distance<c.reach&&Math.abs(p.position.y)<1&&visible)p.health=Math.max(0,p.health-enemy.damage);
    }continue;
   }
   if(distance<c.reach&&visible&&enemy.cooldown<=0){enemy.windup=c.windup;enemy.aimTarget=target.clone();}
   else if(distance>c.reach*.8||!visible)this.move(enemy,p.position,dt,c.speed);
   else if((enemy.type==='archer'||enemy.type==='mage')&&distance<4){const away=d.normalize().multiplyScalar(-c.speed*dt);Paint.room.move(enemy.mesh.position,away.x,away.z);}
  }
 },
 remaining(){return this.list.filter(e=>e.health>0).length;},
 clear(){for(const e of this.list){this.scene.remove(e.mesh);e.mesh.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}this.list=[];},
 reset(){this.clear();this.spawnWave(Paint.config.stages[0].rooms[0]);}
};
