Paint.monsters = {
 create(scene){this.scene=scene;this.list=[];},
 spawn(){
  for(const [x,z] of Paint.config.rooms[0].enemies){
   const group=new ri(),mat=new Wr({color:0xefe5ca,roughness:.9}),dark=new $n({color:0x344b50});
   const part=(geo,x,y,z,material=mat)=>{const m=new $e(geo,material);m.position.set(x,y,z);m.castShadow=true;group.add(m);return m;};
   part(new Pn(.32,12,10),0,1.65,0);for(const x of [-.12,.12])part(new Pn(.075,8,6),x,1.7,-.275,dark);
   part(new mi(.24,.6,.2),0,1.05,0);for(const y of [.9,1.05,1.2])part(new mi(.5,.06,.25),0,y,0);
   for(const x of [-.23,.23]){part(new mr(.065,.065,.65,8),x,.4,0);part(new mr(.065,.065,.6,8),x*1.4,1.08,0);}
   part(new mi(.12,.7,.07),.4,1,-.3,new Wr({color:0xaabec3}));
   group.position.set(x,0,z);this.scene.add(group);this.list.push({mesh:group,health:Paint.config.monsters.skeleton.health,cooldown:0,path:[],routeTime:0});
  }
 },
 damage(enemy,amount){if(enemy.health<=0)return;enemy.health-=amount;if(enemy.health<=0){enemy.mesh.visible=false;Paint.player.kills++;Paint.drops.spawn(enemy.mesh.position);Paint.effects.burst(enemy.mesh.position.clone().add(new I(0,1,0)),0xf2e8ca);}},
 update(dt){const c=Paint.config.monsters.skeleton,p=Paint.player;
  for(const enemy of this.list){if(enemy.health<=0)continue;const d=p.position.clone().sub(enemy.mesh.position);d.y=0;const distance=d.length();enemy.cooldown-=dt;
   enemy.mesh.rotation.y=Math.atan2(-d.x,-d.z);
   if(distance>c.reach){
    enemy.routeTime-=dt;
    if(enemy.routeTime<=0){enemy.path=Paint.room.path(enemy.mesh.position,p.position);enemy.routeTime=.75;}
    while(enemy.path.length&&enemy.mesh.position.distanceTo(enemy.path[0])<.35)enemy.path.shift();
    const direction=(enemy.path[0]||p.position).clone().sub(enemy.mesh.position);direction.y=0;direction.normalize();
    Paint.room.move(enemy.mesh.position,direction.x*c.speed*dt,direction.z*c.speed*dt);
   }
   else if(enemy.cooldown<=0&&p.position.y<1){p.health=Math.max(0,p.health-c.damage);enemy.cooldown=c.interval;}
  }
 },
 remaining(){return this.list.filter(e=>e.health>0).length;},
 reset(){for(const e of this.list){this.scene.remove(e.mesh);e.mesh.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}this.list=[];this.spawn();}
};
