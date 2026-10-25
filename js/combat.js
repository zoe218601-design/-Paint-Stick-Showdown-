// 战斗独立于模型和房间：射线始终穿过画面中心，没有跑动散射或后坐力。
Paint.combat={
 reset(){this.ammo=Paint.config.weapon.magazine;this.reserve=Paint.config.weapon.reserve;this.cooldown=0;this.reloadTime=0;},
 reload(){const c=Paint.config.weapon;if(!this.reloadTime&&this.ammo<c.magazine&&this.reserve>0)this.reloadTime=c.reload;},
 update(dt,firing){this.cooldown=Math.max(0,this.cooldown-dt);
  if(this.reloadTime>0){this.reloadTime=Math.max(0,this.reloadTime-dt);if(!this.reloadTime){const count=Math.min(Paint.config.weapon.magazine-this.ammo,this.reserve);this.ammo+=count;this.reserve-=count;}return;}
  if(firing&&this.cooldown===0)this.shoot();
 },
 shoot(){const c=Paint.config.weapon;if(this.ammo===0){this.reload();return;}this.ammo--;this.cooldown=c.interval;
  Paint.camera.updateMatrixWorld();const ray=new Wo();ray.setFromCamera(new Ve(0,0),Paint.camera);ray.far=c.range;
  const alive=Paint.monsters.list.filter(e=>e.health>0);
  const hits=ray.intersectObjects([...Paint.room.walls,...alive.map(e=>e.mesh)],true);
  if(!hits.length)return;const hit=hits[0];
  const enemy=alive.find(e=>{let o=hit.object;while(o){if(o===e.mesh)return true;o=o.parent;}return false;});
  // 肩后相机能看到的目标，仍需检查枪口到目标的掩体，防止隔墙射击。
  const muzzle=Paint.player.position.clone().add(new I(0,1.2,0));const direction=hit.point.clone().sub(muzzle);
  const wall=new Wo(muzzle,direction.clone().normalize(),0,direction.length()-.05).intersectObjects(Paint.room.walls,false)[0];
  if(enemy&&!wall)Paint.monsters.damage(enemy,c.damage);
  Paint.effects.burst(wall?wall.point:hit.point,enemy&&!wall?0xf4cf65:0x3289df);
 }
};
