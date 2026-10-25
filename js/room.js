// 场景沿用旧版的柔和光照、圆润几何体和颜料配色。
Paint.room = {
 build(scene) {
  this.solids=[]; this.walls=[]; const data=Paint.config.rooms[0], half=data.size/2;
  const box=(x,y,z,w,h,d,color,solid=true)=>{
   const mesh=new $e(new mi(w,h,d),new Wr({color,roughness:.85}));
   mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
   if(solid){this.solids.push({x,z,w,d,h});this.walls.push(mesh);}return mesh;
  };
  box(0,-.2,0,data.size,.4,data.size,0xd7d7bc,false);
  for(const x of [-half,half])box(x,2,0,.6,4,data.size,0x889e99);
  box(0,2,half,data.size,4,.6,0x889e99);
  // 出口两边的墙，中间保留通行空间。
  box(-7,2,-half,12,4,.6,0x889e99);box(7,2,-half,12,4,.6,0x889e99);
  for(const [x,z,w,h,d] of data.covers)box(x,h/2,z,w,h,d,0xb9c6ae);
  for(const x of [-11,11])for(const z of [-10,0,10]){
   box(x,2,z,.8,4,.8,0xa5b6a7);box(x,4,z,1.1,.25,1.1,0xd8ddc4,false);
  }
  this.gate=box(0,1.7,-half,2,3.4,.4,0xe57762,false);
  for(const x of [-1.3,1.3])box(x,1.8,-half,.35,3.6,.6,0xd6b76a,false);
  box(0,3.6,-half,3,.35,.6,0xd6b76a,false);
  this.half=half;this.unlocked=false;
 },
 free(x,z,r=Paint.config.player.radius){
  return Math.abs(x)<this.half-r-.3 && z<this.half-r-.3 && z> -this.half+r+.3 &&
   !this.solids.some(s=>Math.abs(x-s.x)<s.w/2+r&&Math.abs(z-s.z)<s.d/2+r);
 },
 move(position,dx,dz){if(this.free(position.x+dx,position.z))position.x+=dx;if(this.free(position.x,position.z+dz))position.z+=dz;},
 // 小网格寻路让刀兵绕过箱子，不会一直顶着掩体。
 path(from,to){
  const start=[Math.round(from.x),Math.round(from.z)],goal=[Math.round(to.x),Math.round(to.z)];
  const key=(x,z)=>x+","+z, queue=[start],previous=new Map([[key(...start),null]]);
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i];if(x===goal[0]&&z===goal[1]){const path=[];let node=[x,z];while(node){path.unshift(new I(node[0],0,node[1]));node=previous.get(key(...node));}return path.slice(1);}
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(!previous.has(k)&&this.free(nx,nz,.45)){previous.set(k,[x,z]);queue.push([nx,nz]);}}
  }return [];
 },
 unlock(){this.unlocked=true;this.gate.visible=false;}
};
