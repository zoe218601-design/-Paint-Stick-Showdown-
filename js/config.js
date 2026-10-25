// 地牢章节的数据表。数值先保证完整流程可玩，后续可单独调平衡。
window.Paint = window.Paint || {};
Paint.config = {
 CAMERA_MODE:'TPS',
 player:{health:100,speed:5,sprint:7,jump:6.4,gravity:18,radius:.4,eye:1.6},
 camera:{fov:70,distance:3.5,shoulder:.65,sensitivity:.002,near:.15},
 weapon:{damage:25,interval:.15,magazine:30,reserve:240,reload:1.5,range:65,reserveMax:480},
 monsters:{
  skeleton:{health:75,speed:1.9,damage:12,reach:1.6,interval:1.4,windup:.5,coins:10,color:0xefe5ca},
  archer:{health:60,speed:1.6,damage:14,reach:17,interval:2.5,windup:.65,projectileSpeed:11,coins:15,color:0xd8d9b0},
  mage:{health:90,speed:1.4,damage:19,reach:19,interval:3.4,windup:.9,projectileSpeed:7,coins:20,color:0xc5b7df},
  king:{health:1800,speed:.65,damage:22,reach:2.8,interval:2,windup:.8,coins:200,color:0xffd784}
 },
 difficulty:{healthStage:.18,healthRoom:.07,damageStage:.12,damageRoom:.04},
 boss:{warning:1.5,fall:.45,radius:2.8,damage:80,height:13,impactDuration:.35,
  thresholds:[.6,.3],smashIntervals:[6,4.5,3.2],skulls:[1,2,3],summonIntervals:[12,10,8],summonCount:[2,3,4],minionLimit:10,firstSmash:3,firstSummon:5},
 limits:{monsters:24,projectiles:64,hazards:9,drops:64},
 roomTemplates:[
  {covers:[[-4,-2,2,2,2],[4,1,2,3,2],[0,-7,3,1,1]]},
  {covers:[[-6,-4,2,3,2],[6,-4,2,3,2],[-4,4,3,1,2],[4,4,3,1,2]]},
  {covers:[[-5,0,2,2,6],[5,0,2,2,6],[0,-7,2,1,2]]},
  {covers:[[-6,-6,3,2,2],[5,-3,3,1,2],[-4,3,3,1.5,2],[6,5,2,3,2]]}
 ],
 // 16 个主线房间；最后一个房间固定为骷髅王战。
 stages:[
  {id:'1-1',rooms:[['skeleton','skeleton','skeleton'],['skeleton','skeleton','archer'],['skeleton','archer','mage'],['skeleton','skeleton','archer','mage']]},
  {id:'1-2',rooms:[['skeleton','skeleton','archer','archer'],['skeleton','archer','mage','mage'],['skeleton','skeleton','archer','mage','mage'],['skeleton','skeleton','archer','archer','mage','mage']]},
  {id:'1-3',rooms:[['skeleton','skeleton','archer','mage','mage'],['skeleton','skeleton','archer','archer','mage','mage'],['skeleton','skeleton','skeleton','archer','archer','mage','mage'],['skeleton','skeleton','skeleton','archer','archer','mage','mage','mage']]},
  {id:'1-4',rooms:[['skeleton','skeleton','skeleton','archer','archer','mage','mage'],['skeleton','skeleton','skeleton','archer','archer','mage','mage','mage'],['skeleton','skeleton','skeleton','archer','archer','archer','mage','mage','mage'],['king']]}
 ],
 graph:{r1:{north:'r2'},r2:{north:'r3',east:'eventA'},r3:{north:'r4',west:'extra'},r4:{north:'next'},eventA:{north:'eventB',east:'r2'},eventB:{east:'r2'}},
 events:{weights:{shop:4,trainer:3,altar:3},altarEnemies:4,altarDamageMultiplier:1.25,
  goods:[{id:'heal',price:40,amount:40},{id:'ammo',price:30,amount:150},{id:'power',price:100,amount:.15},{id:'supply',price:80,amount:25}],
  buffs:[{id:'damage',price:80,amount:.1},{id:'health',price:80,amount:20},{id:'reload',price:80,amount:.12}],priceGrowth:.5,maxBuffs:3},
 drops:{healthChance:.4,health:20,ammo:25,pickupRadius:1.5},
 stageSupply:{health:30,ammo:120},effects:{maximum:80,lifetime:.45},
 debug:{heal:'F2',coins:'F3',clear:'F4',exit:'F6',next:'F7',boss:'F8'}
};
