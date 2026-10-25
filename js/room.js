// 每次只保留当前房间的几何体；切换房间释放旧模型，避免越玩越卡。
Paint.room={
 dispose(){if(!this.group)return;Paint.scene.remove(this.group);this.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});},
 build(scene,options={}){
  this.dispose();this.group=new ri();scene.add(this.group);this.solids=[];this.walls=[];this.doors=[];this.options=options;
  const corridor=options.corridor,half=13;this.half=half;this.bounds=corridor?{x:3,z:6}:{x:half,z:half};
  const box=(x,y,z,w,h,d,color,solid=true)=>{const mesh=new $e(new mi(w,h,d),new Wr({color,roughness:.85}));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;this.group.add(mesh);mesh.updateMatrixWorld(true);if(solid){this.solids.push({x,z,w,d,h});this.walls.push(mesh);}return mesh;};
  this.box=box;box(0,-.2,0,corridor?6:26,.4,corridor?12:26,0xd7d7bc,false);
  if(corridor){box(-3,2,0,.5,4,12,0x889e99);box(3,2,0,.5,4,12,0x889e99);box(0,1.5,6,6,3,.5,0x889e99);this.unlocked=true;return;}
  const connections=options.doors||{north:'next'};
  // 四面墙根据关卡图留门洞。南侧入口始终封闭，禁止原路退回主线。
  for(const side of ['north','east','west','south']){
   const horizontal=side==='north'||side==='south',sign=side==='north'||side==='west'?-1:1;
   if(connections[side]){
    for(const center of [-7,7])box(horizontal?center:sign*half,2,horizontal?sign*half:center,horizontal?12:.6,4,horizontal?.6:12,0x889e99);
    const mesh=box(horizontal?0:sign*half,1.7,horizontal?sign*half:0,horizontal?2:.4,3.4,horizontal?.4:2,connections[side]==='extra'?0x718b9c:0xe57762,false);
    for(const offset of [-1.3,1.3])box(horizontal?offset:sign*half,1.8,horizontal?sign*half:offset,horizontal?.3:.6,3.6,horizontal?.6:.3,0xd6b76a,false);
    this.doors.push({side,target:connections[side],mesh});
   }else box(horizontal?0:sign*half,2,horizontal?sign*half:0,horizontal?26:.6,4,horizontal?.6:26,0x889e99);
  }
  this.gate=this.doors[0]?.mesh;
  const template=Paint.config.roomTemplates[options.templateIndex??0];
  if(!options.event&&!options.boss)for(const [x,z,w,h,d] of template.covers)box(x,h/2,z,w,h,d,0xb9c6ae);
  for(const x of [-11,11])for(const z of [-10,10]){box(x,2,z,.8,4,.8,0xa5b6a7);box(x,4,z,1.1,.25,1.1,0xd8ddc4,false);}
  if(options.event){const colors={shop:0x7ec8a2,trainer:0x6aa9e2,altar:0xc898ef};box(0,.5,0,2,1,2,colors[options.event.type],false);}
  this.lock();
 },
 free(x,z,r=Paint.config.player.radius){return Math.abs(x)<this.bounds.x-r-.3&&Math.abs(z)<this.bounds.z-r-.3&&!this.solids.some(s=>Math.abs(x-s.x)<s.w/2+r&&Math.abs(z-s.z)<s.d/2+r);},
 move(position,dx,dz){if(this.free(position.x+dx,position.z))position.x+=dx;if(this.free(position.x,position.z+dz))position.z+=dz;},
 // 网格搜索避开箱子；允许追踪站在网格边界上的玩家。
 path(from,to){
  const start=[Math.round(from.x),Math.round(from.z)],goal=[Math.round(to.x),Math.round(to.z)],key=(x,z)=>x+','+z,queue=[start],previous=new Map([[key(...start),null]]);
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i];if(Math.hypot(x-goal[0],z-goal[1])<=1){const path=[];let node=[x,z];while(node){path.unshift(new I(node[0],0,node[1]));node=previous.get(key(...node));}return path.slice(1);}
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(!previous.has(k)&&this.free(nx,nz,.45)){previous.set(k,[x,z]);queue.push([nx,nz]);}}
  }return [];
 },
 lock(){this.unlocked=false;for(const d of this.doors)d.mesh.visible=true;},
 unlock(){this.unlocked=true;for(const d of this.doors)d.mesh.visible=d.target==='extra';},
 blocked(from,to){const direction=to.clone().sub(from);return !!new Wo(from,direction.clone().normalize(),0,Math.max(0,direction.length()-.05)).intersectObjects(this.walls,false)[0];}
};
