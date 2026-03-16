export const enumConfig = {
  category: {label:'物料分类',icon:'📂',color:'purple',items:['电阻','电容','芯片','电感','二极管','LED','晶振','连接器','PCB','机壳','显示','电池','射频','电源','传感器','包装','结构件','线材']},
  status: {label:'物料状态',icon:'🏷',color:'green',items:['有效','待审','停用','试产','EOL(停产)']},
  unit: {label:'计量单位',icon:'📏',color:'blue',items:['个','块','条','套','张','本','台','组','片','米','卷','只','颗']},
  supplierLevel: {label:'供应商等级',icon:'⭐',color:'yellow',items:['战略供应商','合格供应商','待考察','黑名单']},
  materialGrade: {label:'物料等级',icon:'🅰️',color:'red',items:['A (关键物料)','B (重要物料)','C (一般物料)','D (辅助物料)']},
  leadTime: {label:'采购周期',icon:'🕐',color:'orange',items:['标准 (7-14天)','加急 (1-3天)','长周期 (30天+)','现货','按需采购']},
  storage: {label:'存储条件',icon:'🏠',color:'gray',items:['常温常湿','低温冷藏 (<15℃)','防潮 (湿度<40%)','防静电','避光保存','危化品专柜']}
};

export const categoryNames = {R:'电阻',C:'电容',IC:'芯片',L:'电感',D:'二极管',LED:'LED',X:'晶振',CN:'连接器',PCB:'PCB',CASE:'机壳',LCD:'显示',BAT:'电池',RF:'射频',PWR:'电源',SEN:'传感器',PKG:'包装'};
function getCategory(id) { const p = id.split('-')[0]; return categoryNames[p] || p; }
