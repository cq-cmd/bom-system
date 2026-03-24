export const versionDiffs = {
  'V3.0_V2.1': {
    added: [{id:'RF-10005',name:'无线通信模组',spec:'RF-BLE5.0+WiFi',type:'组件'},{id:'RF-20044',name:'WiFi/BLE芯片 ESP32-C3',spec:'QFN-32',type:'物料'},{id:'RF-20045',name:'2.4G陶瓷天线',spec:'贴片',type:'物料'},{id:'RF-20046',name:'射频匹配电路',spec:'π型匹配',type:'物料'},{id:'RF-20047',name:'RF屏蔽罩',spec:'洋白铜',type:'物料'},{id:'RF-20048',name:'SPI Flash 4MB',spec:'W25Q32',type:'物料'},{id:'RF-20049',name:'晶振 40MHz',spec:'2016',type:'物料'},{id:'PWR-10006',name:'电源模块',spec:'5V3A-TypeC',type:'组件'},{id:'PWR-20050',name:'AC-DC电源芯片',spec:'5V3A',type:'物料'},{id:'PWR-20051',name:'变压器 EE16',spec:'贴片',type:'物料'},{id:'PWR-20052',name:'整流桥 MB6S',spec:'600V',type:'物料'},{id:'PWR-20053',name:'保险丝 2A',spec:'快断',type:'物料'},{id:'PWR-20054',name:'共模电感',spec:'10mH',type:'物料'},{id:'PWR-20055',name:'X2安规电容',spec:'0.1μF',type:'物料'},{id:'PWR-20056',name:'Y电容',spec:'2200pF',type:'物料'},{id:'PWR-20057',name:'DC-DC降压模块',spec:'3.3V LDO',type:'物料'},{id:'SENSOR-10007',name:'传感器模组',spec:'MULTI',type:'组件'},{id:'SEN-20058',name:'温湿度传感器 SHT30',spec:'I2C',type:'物料'},{id:'SEN-20059',name:'加速度计 LIS3DH',spec:'I2C',type:'物料'},{id:'SEN-20060',name:'光照传感器 BH1750',spec:'I2C',type:'物料'},{id:'SEN-20061',name:'气压传感器 BMP280',spec:'I2C',type:'物料'},{id:'SEN-20062',name:'接近传感器 VCNL4040',spec:'I2C',type:'物料'},{id:'PKG-10008',name:'包装附件',spec:'STD',type:'组件'},{id:'PKG-20063',name:'彩盒',spec:'白卡',type:'物料'},{id:'PKG-20064',name:'内衬泡棉',spec:'EPE',type:'物料'},{id:'PKG-20065',name:'说明书',spec:'A5',type:'物料'},{id:'PKG-20066',name:'合格证',spec:'铜版纸',type:'物料'},{id:'PKG-20067',name:'保修卡',spec:'A6',type:'物料'},{id:'PKG-20068',name:'USB-C数据线',spec:'1m',type:'物料'},{id:'PKG-20069',name:'防静电袋',spec:'屏蔽袋',type:'物料'},{id:'PKG-20070',name:'封箱贴纸',spec:'易碎标',type:'物料'}],
    removed: [],
    modified: []
  },
  'V2.1_V2.0': {
    added: [{id:'R-20016',name:'贴片电阻 4.7KΩ',spec:'0402',type:'物料'},{id:'R-20017',name:'贴片电阻 100Ω',spec:'0603',type:'物料'},{id:'C-20018',name:'贴片电容 10μF',spec:'0805',type:'物料'},{id:'C-20019',name:'电解电容 470μF',spec:'Φ8',type:'物料'},{id:'IC-20020',name:'运算放大器 LM358',spec:'SOP-8',type:'物料'},{id:'IC-20021',name:'Flash存储芯片 W25Q128',spec:'128Mbit',type:'物料'},{id:'IC-20022',name:'ESD保护芯片',spec:'TVS',type:'物料'},{id:'D-20023',name:'肖特基二极管 SS34',spec:'SMA',type:'物料'},{id:'LED-20024',name:'贴片LED 绿色',spec:'0603',type:'物料'},{id:'LED-20025',name:'贴片LED 红色',spec:'0603',type:'物料'},{id:'X-20026',name:'晶振 8MHz',spec:'HC-49S',type:'物料'},{id:'X-20027',name:'晶振 32.768KHz',spec:'2012',type:'物料'},{id:'CN-20028',name:'USB Type-C 母座',spec:'16Pin',type:'物料'},{id:'CN-20029',name:'SMA天线座',spec:'直插',type:'物料'},{id:'PCB-20030',name:'PCB裸板',spec:'4层FR4',type:'物料'},{id:'LCD-20037',name:'触摸屏面板',spec:'电容式',type:'物料'},{id:'LCD-20038',name:'触摸控制IC GT911',spec:'QFN-28',type:'物料'},{id:'LCD-20039',name:'OCA光学胶',spec:'4.3寸',type:'物料'},{id:'LCD-20040',name:'LCD铁框',spec:'铝合金CNC',type:'物料'},{id:'CASE-20031',name:'螺丝 M2.5×6',spec:'内六角',type:'物料'},{id:'CASE-20032',name:'铜柱 M3×10',spec:'黄铜',type:'物料'},{id:'CASE-20033',name:'防滑垫',spec:'硅胶',type:'物料'},{id:'CASE-20034',name:'铭牌标签',spec:'铝质',type:'物料'},{id:'CASE-20035',name:'密封胶圈',spec:'O型硅胶',type:'物料'},{id:'CASE-20036',name:'按键帽',spec:'硅胶',type:'物料'},{id:'BAT-20041',name:'电池温度传感器',spec:'NTC',type:'物料'},{id:'BAT-20042',name:'电池包装膜',spec:'PVC热缩',type:'物料'},{id:'BAT-20043',name:'充电管理IC TP4056',spec:'SOP-8',type:'物料'}],
    removed: [],
    modified: [{id:'LCD-10003',name:'显示屏模组',field:'触控方式',oldVal:'无触摸',newVal:'电容触摸'}]
  },
  'V2.0_V1.1': {
    added: [{id:'BAT-10004',name:'电池组件',spec:'BAT-3.7V-5000',type:'组件'},{id:'BAT-20013',name:'锂聚合物电池',spec:'3.7V/5000mAh',type:'物料'},{id:'BAT-20014',name:'电池保护板',spec:'1S/3A/带NTC',type:'物料'},{id:'BAT-20015',name:'电池连接器',spec:'PH2.0-2P',type:'物料'}],
    removed: [],
    modified: [{id:'LCD-10003',name:'显示屏模组',field:'供应商',oldVal:'天马微电子',newVal:'京东方'}]
  },
  'V1.1_V1.0': {
    added: [{id:'IC-20004',name:'电源管理IC',spec:'SOT-23-5',type:'物料'}],
    removed: [],
    modified: [{id:'R-20001',name:'贴片电阻 10KΩ',field:'用量',oldVal:'80',newVal:'100'}]
  },
  'V1.0_V0.9': {
    added: [{id:'LCD-10003',name:'显示屏模组',spec:'LCD-4.3-TFT',type:'组件'},{id:'LCD-20010',name:'4.3寸TFT LCD面板',spec:'480×272/RGB',type:'物料'},{id:'LCD-20011',name:'背光模组',spec:'LED侧入式/白光',type:'物料'},{id:'LCD-20012',name:'FPC排线',spec:'40Pin/0.5mm间距',type:'物料'}],
    removed: [],
    modified: []
  },
  'V0.9_V0.8-beta': {
    added: [{id:'CASE-20008',name:'螺丝 M3×8',spec:'304不锈钢',type:'物料'},{id:'CASE-20009',name:'导光柱',spec:'透明PC',type:'物料'}],
    removed: [{id:'CASE-20099',name:'临时固定夹',spec:'塑料',type:'物料'}],
    modified: [{id:'CASE-10002',name:'机壳组件',field:'供应商',oldVal:'通用模具',newVal:'精模科技'}]
  },
  'V0.8-beta_V0.5-alpha': {
    added: [{id:'IC-20004',name:'电源管理IC',spec:'SOT-23-5',type:'物料'},{id:'D-20023',name:'肖特基二极管',spec:'SMA',type:'物料'},{id:'L-20005',name:'贴片电感 4.7μH',spec:'0806',type:'物料'}],
    removed: [],
    modified: [{id:'IC-20003',name:'主控芯片',field:'型号',oldVal:'STM32F103',newVal:'STM32F407VET6'}]
  }
};
