Paint.drops = {
 create(scene){this.scene=scene;this.items=[];},
 spawn(position,coins=10){
  if(this.items.length>=Paint.config.limits.drops)this.remove(0);const health=Math.random()<Paint.config.drops.healthChance;
  const mesh=new $e(new Pn(.2,8,6),new Wr({color:health?0x82daa2:0xf1c65f}));mesh.position.copy(position);mesh.position.y=.35;this.scene.add(mesh);this.items.push({mesh,health,coins});
  // 每个掉落都含金币；绿色球额外回血，走过去才会拾取。
 },
 update(dt){for(let i=this.items.length-1;i>=0;i--){const d=this.items[i];d.mesh.rotation.y+=dt*2;
  if(d.mesh.position.distanceTo(Paint.player.position)<Paint.config.drops.pickupRadius){
   Paint.player.coins+=d.coins;
   if(d.health)Paint.player.health=Math.min(Paint.player.maxHealth,Paint.player.health+Paint.config.drops.health);
   Paint.combat.reserve=Math.min(Paint.config.weapon.reserveMax,Paint.combat.reserve+Paint.config.drops.ammo);
   this.remove(i);
  }
 }},
 remove(i){const d=this.items[i];this.scene.remove(d.mesh);d.mesh.geometry.dispose();d.mesh.material.dispose();this.items.splice(i,1);},
 reset(){while(this.items.length)this.remove(0);}
};
// 所有命中粒子共享数量上限，并在到期或重试时清除。
Paint.effects={items:[],burst(position,color){for(let i=0;i<8&&this.items.length<Paint.config.effects.maximum;i++){
 const mesh=new $e(new mi(.08,.08,.08),new $n({color}));mesh.position.copy(position);Paint.scene.add(mesh);
 this.items.push({mesh,age:0,velocity:new I(Math.random()-.5,Math.random(),Math.random()-.5).multiplyScalar(4)});
 }},update(dt){for(let i=this.items.length-1;i>=0;i--){const e=this.items[i];e.age+=dt;e.mesh.position.addScaledVector(e.velocity,dt);
 if(e.age>Paint.config.effects.lifetime){Paint.scene.remove(e.mesh);e.mesh.geometry.dispose();e.mesh.material.dispose();this.items.splice(i,1);}}},reset(){this.update(100);}};
