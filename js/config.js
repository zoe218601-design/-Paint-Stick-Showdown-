// 第一阶段只配置一个房间；增加内容时优先改这里的数字。
window.Paint = window.Paint || {};
Paint.config = {
  CAMERA_MODE: 'TPS', // 第三人称过肩视角（用户指定）。
  player: { health: 100, speed: 5, sprint: 7, jump: 6.4, gravity: 18, radius: .4, eye: 1.6 },
  camera: { fov: 70, distance: 3.5, shoulder: .65, sensitivity: .002, near: .15 },
  weapon: { damage: 25, interval: .15, magazine: 30, reserve: 180, reload: 1.5, range: 65 },
  monsters: { skeleton: { health: 75, speed: 1.7, damage: 12, reach: 1.5, interval: 1, coins: 10 } },
  rooms: [{ size: 26, enemies: [[-8,-8],[7,-8],[-8,5],[8,5]],
    covers: [[-4,-2,2,2,2],[4,1,2,3,2],[0,-7,3,1,1]] }],
  drops: { healthChance: .35, health: 20, pickupRadius: 1.5 },
  effects: { maximum: 80, lifetime: .45 },
  debug: { heal: 'F2', coins: 'F3', clear: 'F4', exit: 'F6' }
};
