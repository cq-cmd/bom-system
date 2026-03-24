export const bomDataA100 = {
  id:'A100-00001',name:'整机 A100',spec:'A100-STD-2024',unit:'台',qty:1,price:1280,supplier:'—',status:'有效',level:0,icon:'📦',
  children:[
    {id:'PCB-10001',name:'PCBA 主板',spec:'MB-V3.2',unit:'块',qty:1,price:320,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'R-20001',name:'贴片电阻 10KΩ',spec:'0402-10KΩ±1%',unit:'个',qty:100,price:0.02,supplier:'国巨电子',status:'有效',level:2,icon:'🔴'},
      {id:'R-20016',name:'贴片电阻 4.7KΩ',spec:'0402-4.7KΩ±1%',unit:'个',qty:60,price:0.02,supplier:'国巨电子',status:'有效',level:2,icon:'🔴'},
      {id:'R-20017',name:'贴片电阻 100Ω',spec:'0603-100Ω±5%',unit:'个',qty:30,price:0.01,supplier:'风华高科',status:'有效',level:2,icon:'🔴'},
      {id:'C-20002',name:'贴片电容 100nF',spec:'0402-100nF/16V',unit:'个',qty:50,price:0.03,supplier:'三星电机',status:'有效',level:2,icon:'🟡'},
      {id:'C-20018',name:'贴片电容 10μF',spec:'0805-10μF/25V',unit:'个',qty:20,price:0.05,supplier:'太阳诱电',status:'有效',level:2,icon:'🟡'},
      {id:'C-20019',name:'电解电容 470μF',spec:'Φ8×12/35V',unit:'个',qty:4,price:0.85,supplier:'尼吉康',status:'有效',level:2,icon:'🟡'},
      {id:'IC-20003',name:'主控芯片 STM32F407',spec:'LQFP-100',unit:'个',qty:1,price:28.5,supplier:'意法半导体',status:'有效',level:2,icon:'⬛'},
      {id:'IC-20004',name:'电源管理IC',spec:'SOT-23-5',unit:'个',qty:2,price:3.2,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'IC-20020',name:'运算放大器 LM358',spec:'SOP-8',unit:'个',qty:3,price:1.2,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'IC-20021',name:'Flash存储芯片 W25Q128',spec:'SOP-8/128Mbit',unit:'个',qty:1,price:6.8,supplier:'华邦电子',status:'有效',level:2,icon:'⬛'},
      {id:'IC-20022',name:'ESD保护芯片',spec:'SOT-23-6/TVS',unit:'个',qty:6,price:0.45,supplier:'安世半导体',status:'待审',level:2,icon:'⬛'},
      {id:'L-20005',name:'功率电感 4.7μH',spec:'3015-4.7μH/2A',unit:'个',qty:3,price:0.45,supplier:'顺络电子',status:'待审',level:2,icon:'🟢'},
      {id:'D-20023',name:'肖特基二极管 SS34',spec:'SMA/40V-3A',unit:'个',qty:4,price:0.18,supplier:'长电科技',status:'有效',level:2,icon:'🔵'},
      {id:'LED-20024',name:'贴片LED 绿色',spec:'0603/绿光/20mA',unit:'个',qty:5,price:0.06,supplier:'亿光电子',status:'有效',level:2,icon:'🟢'},
      {id:'LED-20025',name:'贴片LED 红色',spec:'0603/红光/20mA',unit:'个',qty:3,price:0.06,supplier:'亿光电子',status:'有效',level:2,icon:'🔴'},
      {id:'X-20026',name:'晶振 8MHz',spec:'HC-49S/8MHz±20ppm',unit:'个',qty:1,price:0.55,supplier:'泰晶科技',status:'有效',level:2,icon:'💎'},
      {id:'X-20027',name:'晶振 32.768KHz',spec:'2012/32.768KHz',unit:'个',qty:1,price:0.35,supplier:'泰晶科技',status:'有效',level:2,icon:'💎'},
      {id:'CN-20028',name:'USB Type-C 母座',spec:'16Pin/沉板式',unit:'个',qty:1,price:1.8,supplier:'中航光电',status:'有效',level:2,icon:'🔌'},
      {id:'CN-20029',name:'SMA天线座',spec:'SMA-KE/PCB直插',unit:'个',qty:1,price:2.5,supplier:'泰兴电子',status:'待审',level:2,icon:'🔌'},
      {id:'PCB-20030',name:'PCB裸板',spec:'4层/FR4/1.6mm/沉金',unit:'块',qty:1,price:18.0,supplier:'深南电路',status:'有效',level:2,icon:'🟩'}
    ]},
    {id:'CASE-10002',name:'机壳组件',spec:'CASE-A100',unit:'套',qty:1,price:85,supplier:'精模科技',status:'有效',level:1,icon:'🔧',children:[
      {id:'CASE-20006',name:'上盖(PC+ABS)',spec:'210x150x3mm',unit:'个',qty:1,price:32,supplier:'精模科技',status:'有效',level:2,icon:'📐'},
      {id:'CASE-20007',name:'下盖(PC+ABS)',spec:'210x150x2.5mm',unit:'个',qty:1,price:28,supplier:'精模科技',status:'有效',level:2,icon:'📐'},
      {id:'CASE-20008',name:'螺丝 M3×8',spec:'304不锈钢/十字盘头',unit:'个',qty:12,price:0.08,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'},
      {id:'CASE-20031',name:'螺丝 M2.5×6',spec:'304不锈钢/内六角',unit:'个',qty:8,price:0.06,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'},
      {id:'CASE-20032',name:'铜柱 M3×10',spec:'黄铜/单头六角',unit:'个',qty:6,price:0.12,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'},
      {id:'CASE-20009',name:'导光柱',spec:'Φ3×8mm/透明PC',unit:'个',qty:4,price:0.15,supplier:'精模科技',status:'待审',level:2,icon:'💡'},
      {id:'CASE-20033',name:'防滑垫',spec:'Φ12×2mm/硅胶/黑色',unit:'个',qty:4,price:0.08,supplier:'精模科技',status:'有效',level:2,icon:'⚫'},
      {id:'CASE-20034',name:'铭牌标签',spec:'30x15mm/铝质/丝印',unit:'张',qty:1,price:0.5,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'CASE-20035',name:'密封胶圈',spec:'O型/硅胶/Φ180',unit:'个',qty:1,price:1.2,supplier:'精模科技',status:'有效',level:2,icon:'⭕'},
      {id:'CASE-20036',name:'按键帽',spec:'硅胶/12x12mm/灰色',unit:'个',qty:3,price:0.25,supplier:'精模科技',status:'有效',level:2,icon:'🔘'}
    ]},
    {id:'LCD-10003',name:'显示屏模组',spec:'LCD-4.3-TFT',unit:'个',qty:1,price:165,supplier:'京东方',status:'有效',level:1,icon:'🖥',children:[
      {id:'LCD-20010',name:'4.3寸TFT LCD面板',spec:'480×272/RGB',unit:'个',qty:1,price:95,supplier:'京东方',status:'有效',level:2,icon:'🖼'},
      {id:'LCD-20011',name:'背光模组',spec:'LED侧入式/白光',unit:'个',qty:1,price:35,supplier:'瑞丰光电',status:'有效',level:2,icon:'💡'},
      {id:'LCD-20012',name:'FPC排线',spec:'40Pin/0.5mm间距',unit:'条',qty:1,price:4.5,supplier:'立讯精密',status:'停用',level:2,icon:'〰️'},
      {id:'LCD-20037',name:'触摸屏面板',spec:'4.3寸/电容式/I2C',unit:'个',qty:1,price:22.0,supplier:'汇顶科技',status:'有效',level:2,icon:'👆'},
      {id:'LCD-20038',name:'触摸控制IC GT911',spec:'QFN-28',unit:'个',qty:1,price:4.5,supplier:'汇顶科技',status:'有效',level:2,icon:'⬛'},
      {id:'LCD-20039',name:'OCA光学胶',spec:'4.3寸/透明/0.175mm',unit:'张',qty:1,price:3.8,supplier:'三利谱',status:'有效',level:2,icon:'📜'},
      {id:'LCD-20040',name:'LCD铁框',spec:'铝合金/CNC/阳极氧化',unit:'个',qty:1,price:8.5,supplier:'精模科技',status:'待审',level:2,icon:'🔲'}
    ]},
    {id:'BAT-10004',name:'电池组件',spec:'BAT-3.7V-5000',unit:'组',qty:1,price:42,supplier:'比亚迪电子',status:'有效',level:1,icon:'🔋',children:[
      {id:'BAT-20013',name:'锂聚合物电池',spec:'3.7V/5000mAh',unit:'个',qty:1,price:35,supplier:'比亚迪电子',status:'有效',level:2,icon:'🔋'},
      {id:'BAT-20014',name:'电池保护板',spec:'1S/3A/带NTC',unit:'个',qty:1,price:4.8,supplier:'中颖电子',status:'有效',level:2,icon:'🛡'},
      {id:'BAT-20015',name:'电池连接器',spec:'PH2.0-2P',unit:'个',qty:1,price:0.35,supplier:'JST',status:'有效',level:2,icon:'🔌'},
      {id:'BAT-20041',name:'电池温度传感器',spec:'NTC/10KΩ/B3950',unit:'个',qty:1,price:0.6,supplier:'中颖电子',status:'有效',level:2,icon:'🌡'},
      {id:'BAT-20042',name:'电池包装膜',spec:'PVC热缩膜/蓝色',unit:'个',qty:1,price:0.15,supplier:'比亚迪电子',status:'有效',level:2,icon:'📦'},
      {id:'BAT-20043',name:'充电管理IC TP4056',spec:'SOP-8/1A线性',unit:'个',qty:1,price:0.8,supplier:'拓微集成',status:'有效',level:2,icon:'⬛'}
    ]},
    {id:'RF-10005',name:'无线通信模组',spec:'RF-BLE5.0+WiFi',unit:'个',qty:1,price:45,supplier:'乐鑫科技',status:'有效',level:1,icon:'📡',children:[
      {id:'RF-20044',name:'WiFi/BLE芯片 ESP32-C3',spec:'QFN-32/RISC-V',unit:'个',qty:1,price:12.0,supplier:'乐鑫科技',status:'有效',level:2,icon:'📶'},
      {id:'RF-20045',name:'2.4G陶瓷天线',spec:'2.4GHz/3dBi/贴片',unit:'个',qty:1,price:1.5,supplier:'信维通信',status:'有效',level:2,icon:'📡'},
      {id:'RF-20046',name:'射频匹配电路',spec:'0402/π型匹配',unit:'套',qty:1,price:0.15,supplier:'国巨电子',status:'有效',level:2,icon:'🔴'},
      {id:'RF-20047',name:'RF屏蔽罩',spec:'15x12x2mm/洋白铜',unit:'个',qty:1,price:1.8,supplier:'精模科技',status:'待审',level:2,icon:'🛡'},
      {id:'RF-20048',name:'SPI Flash 4MB',spec:'SOP-8/W25Q32',unit:'个',qty:1,price:3.2,supplier:'华邦电子',status:'有效',level:2,icon:'⬛'},
      {id:'RF-20049',name:'晶振 40MHz',spec:'2016/40MHz±10ppm',unit:'个',qty:1,price:0.65,supplier:'泰晶科技',status:'有效',level:2,icon:'💎'}
    ]},
    {id:'PWR-10006',name:'电源模块',spec:'PWR-5V3A-TypeC',unit:'个',qty:1,price:38,supplier:'航嘉驰源',status:'有效',level:1,icon:'⚡',children:[
      {id:'PWR-20050',name:'AC-DC电源芯片',spec:'SOP-8/5V3A',unit:'个',qty:1,price:5.5,supplier:'矽力杰',status:'有效',level:2,icon:'⬛'},
      {id:'PWR-20051',name:'变压器 EE16',spec:'EE16/5V3A/贴片',unit:'个',qty:1,price:3.8,supplier:'京泉华',status:'有效',level:2,icon:'🔄'},
      {id:'PWR-20052',name:'整流桥 MB6S',spec:'SOP-4/600V/0.5A',unit:'个',qty:1,price:0.35,supplier:'长电科技',status:'有效',level:2,icon:'🔵'},
      {id:'PWR-20053',name:'保险丝 2A',spec:'1206/2A/快断',unit:'个',qty:1,price:0.12,supplier:'力特',status:'有效',level:2,icon:'⚡'},
      {id:'PWR-20054',name:'共模电感',spec:'10mH/0.5A/立式',unit:'个',qty:1,price:1.2,supplier:'顺络电子',status:'有效',level:2,icon:'🟢'},
      {id:'PWR-20055',name:'X2安规电容',spec:'275VAC/0.1μF',unit:'个',qty:1,price:0.8,supplier:'法拉电子',status:'有效',level:2,icon:'🟡'},
      {id:'PWR-20056',name:'Y电容',spec:'2200pF/250VAC',unit:'个',qty:2,price:0.25,supplier:'法拉电子',status:'有效',level:2,icon:'🟡'},
      {id:'PWR-20057',name:'DC-DC降压模块 3.3V',spec:'SOT-23-5/LDO/500mA',unit:'个',qty:1,price:0.65,supplier:'圣邦微',status:'有效',level:2,icon:'⬛'}
    ]},
    {id:'SENSOR-10007',name:'传感器模组',spec:'SENSOR-MULTI',unit:'套',qty:1,price:56,supplier:'—',status:'有效',level:1,icon:'🔬',children:[
      {id:'SEN-20058',name:'温湿度传感器 SHT30',spec:'DFN-8/I2C/±0.3℃',unit:'个',qty:1,price:8.5,supplier:'盛思锐',status:'有效',level:2,icon:'🌡'},
      {id:'SEN-20059',name:'加速度计 LIS3DH',spec:'LGA-16/±16g/I2C',unit:'个',qty:1,price:5.2,supplier:'意法半导体',status:'有效',level:2,icon:'📐'},
      {id:'SEN-20060',name:'光照传感器 BH1750',spec:'WSOF-6/I2C/16bit',unit:'个',qty:1,price:3.8,supplier:'罗姆',status:'有效',level:2,icon:'☀️'},
      {id:'SEN-20061',name:'气压传感器 BMP280',spec:'LGA-8/I2C/300-1100hPa',unit:'个',qty:1,price:6.5,supplier:'博世',status:'待审',level:2,icon:'🌀'},
      {id:'SEN-20062',name:'接近传感器 VCNL4040',spec:'LGA/I2C/20cm',unit:'个',qty:1,price:4.2,supplier:'威世',status:'有效',level:2,icon:'👋'}
    ]},
    {id:'PKG-10008',name:'包装附件',spec:'PKG-A100-STD',unit:'套',qty:1,price:15,supplier:'裕同包装',status:'有效',level:1,icon:'📦',children:[
      {id:'PKG-20063',name:'彩盒',spec:'250x180x80mm/350g白卡',unit:'个',qty:1,price:4.5,supplier:'裕同包装',status:'有效',level:2,icon:'📦'},
      {id:'PKG-20064',name:'内衬泡棉',spec:'EPE/定制模切/白色',unit:'套',qty:1,price:2.0,supplier:'裕同包装',status:'有效',level:2,icon:'🧽'},
      {id:'PKG-20065',name:'说明书',spec:'A5/骑马钉/铜版纸',unit:'本',qty:1,price:0.8,supplier:'永丰印务',status:'有效',level:2,icon:'📖'},
      {id:'PKG-20066',name:'合格证',spec:'60x40mm/铜版纸',unit:'张',qty:1,price:0.05,supplier:'永丰印务',status:'有效',level:2,icon:'✅'},
      {id:'PKG-20067',name:'保修卡',spec:'A6/铜版纸/覆膜',unit:'张',qty:1,price:0.15,supplier:'永丰印务',status:'有效',level:2,icon:'📋'},
      {id:'PKG-20068',name:'USB-C数据线',spec:'1m/5V2A/白色',unit:'条',qty:1,price:3.5,supplier:'绿联',status:'有效',level:2,icon:'🔌'},
      {id:'PKG-20069',name:'防静电袋',spec:'250x200mm/屏蔽袋',unit:'个',qty:1,price:0.3,supplier:'裕同包装',status:'有效',level:2,icon:'🛡'},
      {id:'PKG-20070',name:'封箱贴纸',spec:'Φ30mm/易碎标/红色',unit:'个',qty:2,price:0.02,supplier:'永丰印务',status:'有效',level:2,icon:'🔴'}
    ]},
    {id:'CONN-10009',name:'连接器组件',spec:'CONN-MULTI-SET',unit:'套',qty:1,price:28,supplier:'泰科电子',status:'有效',level:1,icon:'🔌',children:[
      {id:'CN-20071',name:'FPC连接器 30Pin',spec:'0.5mm间距/下接/翻盖',unit:'个',qty:2,price:1.8,supplier:'广濑电子',status:'有效',level:2,icon:'🔌'},
      {id:'CN-20072',name:'板对板连接器 60Pin',spec:'0.4mm间距/母座',unit:'个',qty:1,price:3.5,supplier:'莫仕',status:'有效',level:2,icon:'🔌'},
      {id:'CN-20073',name:'板对板连接器 60Pin',spec:'0.4mm间距/公座',unit:'个',qty:1,price:3.2,supplier:'莫仕',status:'有效',level:2,icon:'🔌'},
      {id:'CN-20074',name:'Micro SD卡座',spec:'推拉式/自弹/贴片',unit:'个',qty:1,price:1.2,supplier:'泰科电子',status:'有效',level:2,icon:'💾'},
      {id:'CN-20075',name:'耳机座 3.5mm',spec:'PJ-320A/4段/贴片',unit:'个',qty:1,price:0.65,supplier:'韩荣电子',status:'有效',level:2,icon:'🎧'},
      {id:'CN-20076',name:'排针 2.54mm',spec:'2x5Pin/直插/镀金',unit:'个',qty:1,price:0.35,supplier:'标准件厂',status:'有效',level:2,icon:'📍'},
      {id:'CN-20077',name:'弹簧顶针',spec:'PogoPin/Φ0.9/2mm',unit:'个',qty:4,price:0.85,supplier:'德方纳米',status:'待审',level:2,icon:'📌'},
      {id:'CN-20078',name:'SIM卡座',spec:'Nano SIM/推拉式',unit:'个',qty:1,price:1.5,supplier:'泰科电子',status:'有效',level:2,icon:'📱'}
    ]},
    {id:'MOTOR-10010',name:'马达与振动',spec:'MOTOR-VIB-SET',unit:'套',qty:1,price:18,supplier:'金龙机电',status:'有效',level:1,icon:'⚙️',children:[
      {id:'MOT-20079',name:'线性振动马达',spec:'LRA/Φ10×2.7mm/3V',unit:'个',qty:1,price:4.5,supplier:'金龙机电',status:'有效',level:2,icon:'📳'},
      {id:'MOT-20080',name:'振动马达驱动IC DRV2605',spec:'QFN-10/I2C',unit:'个',qty:1,price:3.8,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'MOT-20081',name:'微型步进电机',spec:'15BY25/5V/7.5°',unit:'个',qty:1,price:6.5,supplier:'鸣志电器',status:'待审',level:2,icon:'⚙️'},
      {id:'MOT-20082',name:'蜂鸣器',spec:'无源/5V/2KHz/贴片',unit:'个',qty:1,price:0.8,supplier:'华能达',status:'有效',level:2,icon:'🔔'},
      {id:'MOT-20083',name:'电磁铁',spec:'微型/3V/推拉式',unit:'个',qty:1,price:2.2,supplier:'金龙机电',status:'有效',level:2,icon:'🧲'}
    ]},
    {id:'CABLE-10011',name:'线束组件',spec:'CABLE-HARNESS',unit:'套',qty:1,price:22,supplier:'立讯精密',status:'有效',level:1,icon:'〰️',children:[
      {id:'CBL-20084',name:'主板-显示屏排线',spec:'FPC/40Pin/80mm',unit:'条',qty:1,price:3.5,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'CBL-20085',name:'电池连接线束',spec:'PH2.0/2P/100mm/红黑',unit:'条',qty:1,price:1.2,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'CBL-20086',name:'天线馈线',spec:'RF同轴/IPEX-MHF4/50mm',unit:'条',qty:1,price:2.8,supplier:'信维通信',status:'有效',level:2,icon:'📡'},
      {id:'CBL-20087',name:'传感器排线',spec:'FPC/10Pin/60mm',unit:'条',qty:1,price:2.0,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'CBL-20088',name:'USB延长线束',spec:'Type-C/150mm/母座带线',unit:'条',qty:1,price:4.5,supplier:'绿联',status:'有效',level:2,icon:'🔌'},
      {id:'CBL-20089',name:'按键排线',spec:'FPC/6Pin/40mm',unit:'条',qty:1,price:1.5,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'CBL-20090',name:'喇叭线束',spec:'2P/80mm/带端子',unit:'条',qty:1,price:0.8,supplier:'立讯精密',status:'有效',level:2,icon:'🔊'}
    ]},
    {id:'EMC-10012',name:'EMC与散热',spec:'EMC-THERMAL',unit:'套',qty:1,price:16,supplier:'飞荣达',status:'待审',level:1,icon:'🛡',children:[
      {id:'EMC-20091',name:'导热硅胶垫',spec:'20x20x1mm/6W/mK',unit:'片',qty:3,price:1.2,supplier:'飞荣达',status:'有效',level:2,icon:'🧊'},
      {id:'EMC-20092',name:'导热铜箔胶带',spec:'25mm宽/0.05mm/单面导电',unit:'米',qty:0.3,price:2.5,supplier:'飞荣达',status:'有效',level:2,icon:'🟫'},
      {id:'EMC-20093',name:'吸波材料',spec:'30x20x0.3mm/GHz频段',unit:'片',qty:2,price:3.8,supplier:'横店东磁',status:'有效',level:2,icon:'⬛'},
      {id:'EMC-20094',name:'EMI滤波磁珠',spec:'0603/600Ω@100MHz',unit:'个',qty:10,price:0.05,supplier:'顺络电子',status:'有效',level:2,icon:'🟤'},
      {id:'EMC-20095',name:'铝合金散热片',spec:'25x25x5mm/黑色阳极',unit:'个',qty:1,price:1.5,supplier:'精模科技',status:'有效',level:2,icon:'🧊'},
      {id:'EMC-20096',name:'导电泡棉',spec:'OLES/10x3mm/卷装',unit:'米',qty:0.5,price:4.0,supplier:'飞荣达',status:'待审',level:2,icon:'🟫'}
    ]},
    {id:'AUDIO-10013',name:'音频组件',spec:'AUDIO-FULL',unit:'套',qty:1,price:32,supplier:'歌尔股份',status:'有效',level:1,icon:'🔊',children:[
      {id:'AUD-20097',name:'微型扬声器',spec:'1511/8Ω/1W/防尘网',unit:'个',qty:1,price:6.5,supplier:'歌尔股份',status:'有效',level:2,icon:'🔊'},
      {id:'AUD-20098',name:'音频功放 MAX98357',spec:'QFN-16/I2S/3.2W',unit:'个',qty:1,price:2.8,supplier:'美信半导体',status:'有效',level:2,icon:'⬛'},
      {id:'AUD-20099',name:'MEMS麦克风',spec:'PDM/SNR65dB/底部开口',unit:'个',qty:2,price:1.2,supplier:'歌尔股份',status:'有效',level:2,icon:'🎤'},
      {id:'AUD-20100',name:'音频滤波器 EMI',spec:'0402/共模扼流圈',unit:'个',qty:2,price:0.25,supplier:'顺络电子',status:'有效',level:2,icon:'🟤'},
      {id:'AUD-20101',name:'扬声器密封垫',spec:'泡棉/1511定制/防震',unit:'个',qty:1,price:0.15,supplier:'飞荣达',status:'有效',level:2,icon:'🧽'},
      {id:'AUD-20102',name:'音腔结构件',spec:'PC+ABS/注塑/密封',unit:'个',qty:1,price:3.5,supplier:'精模科技',status:'有效',level:2,icon:'📐'}
    ]},
    {id:'TEST-10014',name:'测试治具接口',spec:'TEST-JIG-IF',unit:'套',qty:1,price:8,supplier:'—',status:'待审',level:1,icon:'🔧',children:[
      {id:'TST-20103',name:'测试点焊盘',spec:'PCB/Φ1.0mm/镀金/JTAG',unit:'组',qty:1,price:0,supplier:'深南电路',status:'有效',level:2,icon:'🟩'},
      {id:'TST-20104',name:'ICT测试焊盘组',spec:'Bottom/32点/1.27mm间距',unit:'组',qty:1,price:0,supplier:'深南电路',status:'有效',level:2,icon:'🟩'},
      {id:'TST-20105',name:'射频测试SMA座',spec:'SMA-J/PCB/50Ω/测试用',unit:'个',qty:1,price:2.5,supplier:'泰兴电子',status:'待审',level:2,icon:'📡'},
      {id:'TST-20106',name:'治具定位孔',spec:'Φ2mm/镀金/4角',unit:'组',qty:1,price:0,supplier:'深南电路',status:'有效',level:2,icon:'📎'},
      {id:'TST-20107',name:'产测排针接口',spec:'2x10Pin/1.27mm/贴片',unit:'个',qty:1,price:1.8,supplier:'标准件厂',status:'有效',level:2,icon:'📍'}
    ]}
  ]
};
