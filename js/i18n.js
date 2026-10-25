// 所有新界面文字集中在这里，三个位置依次为简体、英文、繁体。
Paint.words = {
 title:['彩弹火柴：地牢试炼','Paint Stick: Dungeon Trial','彩彈火柴：地牢試煉'],
 subtitle:['第 1 步 · 单房间 PVE 框架','Step 1 · Single-room PVE','第 1 步 · 單房間 PVE 框架'],
 start:['进入地牢','Enter dungeon','進入地牢'],resume:['继续游戏','Resume','繼續遊戲'],retry:['重新挑战','Retry','重新挑戰'],
 intro:['清除骷髅刀兵，收集掉落，打开出口。','Defeat the skeletons, collect drops and unlock the exit.','清除骷髏刀兵，收集掉落，打開出口。'],
 controls:['WASD 移动 · Shift 冲刺 · 空格跳跃 · 左键射击 · 右键瞄准 · R 换弹 · Esc 暂停','WASD move · Shift sprint · Space jump · Left fire · Right aim · R reload · Esc pause','WASD 移動 · Shift 衝刺 · 空白鍵跳躍 · 左鍵射擊 · 右鍵瞄準 · R 換彈 · Esc 暫停'],
 fallback:['点击画面锁定鼠标；不支持时按住鼠标拖动转向。','Click to lock pointer; drag to look if pointer lock is unavailable.','點擊畫面鎖定滑鼠；不支援時按住滑鼠拖曳轉向。'],
 health:['生命','Health','生命'],ammo:['弹药','Ammo','彈藥'],coins:['本局金币','Run coins','本局金幣'],remaining:['剩余怪物','Enemies','剩餘怪物'],
 room:['1-1 · 地牢 · 房间 1/1','1-1 · Dungeon · Room 1/1','1-1 · 地牢 · 房間 1/1'],
 locked:['出口锁定 · 清除全部怪物','Exit locked · Defeat all enemies','出口鎖定 · 清除全部怪物'],
 open:['出口已开启 · 走进金色门框','Exit open · Walk through the gold gate','出口已開啟 · 走進金色門框'],
 defeat:['挑战失败','Defeated','挑戰失敗'],complete:['房间通关','Room cleared','房間通關'],
 completeText:['第一步试玩完成，后续关卡尚未开放。','Step 1 complete. More rooms will come later.','第一步試玩完成，後續關卡尚未開放。'],
 pause:['游戏暂停','Paused','遊戲暫停'],reload:['换弹中…','Reloading…','換彈中…'],
 gun:['颜料步枪','Paint rifle','顏料步槍'],kills:['击败','Defeated','擊敗'],
 view:['视角','Camera','視角'],fps:['第一人称','First person','第一人稱'],tps:['过肩视角','Over shoulder','過肩視角'],
 debug:['调试：F2 补血 · F3 加金币 · F4 清怪 · F6 开门','Debug: F2 heal · F3 coins · F4 clear · F6 unlock','調試：F2 補血 · F3 加金幣 · F4 清怪 · F6 開門']
};
Paint.language = 0;
Paint.t = key => Paint.words[key]?.[Paint.language] || key;
