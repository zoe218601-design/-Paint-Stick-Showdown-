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
// 地牢章节与事件房新增文字。
Object.assign(Paint.words,{
 subtitle:['第 1 章 · 地牢 · 1-1 至 1-4','Chapter 1 · Dungeon · 1-1 to 1-4','第 1 章 · 地牢 · 1-1 至 1-4'],
 intro:['闯过 16 个主线房间，击败骷髅王。房间 2 可进入支线，房间 3 的附加关卡暂未开放。','Clear 16 main rooms and defeat the Skeleton King. Room 2 has optional branches; the extra room at room 3 is reserved.','闖過 16 個主線房間，擊敗骷髏王。房間 2 可進入支線，房間 3 的附加關卡暫未開放。'],
 complete:['地牢章节通关！','Dungeon chapter complete!','地牢章節通關！'],
 completeText:['已通过 1-1 至 1-4，击败骷髅王和他的军团。','You cleared 1-1 through 1-4 and defeated the Skeleton King and his army.','已通過 1-1 至 1-4，擊敗骷髏王和他的軍團。'],
 mainRoom:['主线房间','Main room','主線房間'],passage:['安全通道 · 前进进入下个房间','Safe corridor · Walk forward to the next room','安全通道 · 前進進入下個房間'],
 open:['金色门框已开启 · 向前进入安全通道','Gold gate open · Walk forward into the safe corridor','金色門框已開啟 · 向前進入安全通道'],
 branchRoute:['右侧金色门通往可选事件房','Right gold gate leads to optional event rooms','右側金色門通往可選事件房'],
 branch:['可选事件房','Optional event room','可選事件房'],extra:['灰色门为附加关卡 · 尚未开放','Grey gate: extra room · Coming later','灰色門為附加關卡 · 尚未開放'],
 shop:['补给商店','Supply shop','補給商店'],trainer:['教官','Trainer','教官'],altar:['武器祭坛','Weapon altar','武器祭壇'],
 eventHint:['靠近中央按 E 互动 · 可从右侧返回房间 2','Approach the center and press E · Right gate returns to room 2','靠近中央按 E 互動 · 可從右側返回房間 2'],
 altarHint:['按 E 拿取强化步枪 · 拿起它会引来怪物！也可直接离开','Press E for an enhanced rifle · Taking it summons enemies! You may leave instead.','按 E 拿取強化步槍 · 拿起它會引來怪物！也可直接離開'],
 altarTaken:['已获得强化步枪 · 清怪后门才会打开','Enhanced rifle acquired · Clear the ambush to unlock gates','已獲得強化步槍 · 清怪後門才會打開'],
 used:['本房间奖励已领取','Room reward already claimed','本房間獎勵已領取'],
 heal:['血瓶 +40 生命','Health +40','血瓶 +40 生命'],ammoItem:['备弹 +150','Reserve ammo +150','備彈 +150'],power:['步枪伤害 +15%','Rifle damage +15%','步槍傷害 +15%'],supply:['生命 +25，备弹 +75','Health +25, ammo +75','生命 +25，備彈 +75'],
 damage:['本局伤害 +10%','Run damage +10%','本局傷害 +10%'],healthBuff:['最大生命 +20','Max health +20','最大生命 +20'],reloadBuff:['换弹时间 -12%','Reload time -12%','換彈時間 -12%'],
 close:['返回房间','Return to room','返回房間'],bought:['已购买','Purchased','已購買'],notEnough:['金币不足或已达购买上限','Insufficient coins or purchase limit reached','金幣不足或已達購買上限'],
 boss:['骷髅王','Skeleton King','骷髏王'],phase:['阶段','Phase','階段'],warning:['巨型骷髅头即将砸下！离开红圈！','Giant skull incoming! Leave the red circles!','巨型骷髏頭即將砸下！離開紅圈！'],
 summon:['召唤骷髅兵','Summon skeletons','召喚骷髏兵'],buffs:['本局强化','Run upgrades','本局強化'],
 debug:['调试：F2 补血 · F3 金币 · F4 清怪 · F6 开门 · F7 跳房 · F8 骷髅王','Debug: F2 heal · F3 coins · F4 clear · F6 unlock · F7 skip · F8 boss','調試：F2 補血 · F3 金幣 · F4 清怪 · F6 開門 · F7 跳房 · F8 骷髏王'],
 stageSupply:['小关卡之间补充生命和备弹；金币、强化持续到本局结束。','Health and ammo are supplied between stages; coins and upgrades last for this run.','小關卡之間補充生命和備彈；金幣、強化持續到本局結束。']
});
