// 骷髅王：血量越低，落下的骷髅头越多、技能间隔越短。
Paint.boss={
 update(enemy,dt){const c=Paint.config.boss,b=enemy.boss,ratio=enemy.health/enemy.maxHealth;
  b.phase=c.thresholds.filter(threshold=>ratio<=threshold).length;b.smash-=dt;b.summon-=dt;
  if(b.smash<=0){b.smash=c.smashIntervals[b.phase];const center=Paint.player.position.clone();center.y=0;
   // 落点在预警出现时固定，不追踪玩家，始终留出走位时间。
   for(let i=0;i<c.skulls[b.phase];i++){
    const target=center.clone();if(i){const angle=i*Math.PI*2/c.skulls[b.phase];target.x+=Math.cos(angle)*5;target.z+=Math.sin(angle)*5;}
    target.x=Br.clamp(target.x,-9,9);target.z=Br.clamp(target.z,-9,9);Paint.attacks.skull(target);
   }
  }
  if(b.summon<=0){b.summon=c.summonIntervals[b.phase];let count=Paint.monsters.list.filter(e=>e.health>0&&!e.boss).length;
   for(let i=0;i<c.summonCount[b.phase]&&count<c.minionLimit;i++){
    const angle=i*Math.PI*2/c.summonCount[b.phase],x=Br.clamp(enemy.mesh.position.x+Math.cos(angle)*4,-10,10),z=Br.clamp(enemy.mesh.position.z+Math.sin(angle)*4,-10,8);
    if(Paint.room.free(x,z,.6)){Paint.monsters.spawn('skeleton',x,z);count++;Paint.effects.burst(new I(x,1,z),0xbfa6f5);}
   }
  }
 }
};
