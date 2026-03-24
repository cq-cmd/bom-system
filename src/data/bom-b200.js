export const bomDataB200 = {
  id:'B200-00001',name:'智能网关 B200',spec:'B200-GW-2025',unit:'台',qty:1,price:680,supplier:'—',status:'有效',level:0,icon:'📡',
  children:[
    {id:'B-PCB-10001',name:'主控板',spec:'GW-MB-V1.0',unit:'块',qty:1,price:180,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'B-IC-20001',name:'主控芯片 MT7621A',spec:'BGA-399/双核MIPS',unit:'个',qty:1,price:42.0,supplier:'联发科',status:'有效',level:2,icon:'⬛'},
      {id:'B-IC-20002',name:'DDR3 内存 128MB',spec:'BGA-96/DDR3L',unit:'个',qty:1,price:8.5,supplier:'华邦电子',status:'有效',level:2,icon:'⬛'},
      {id:'B-IC-20003',name:'SPI NOR Flash 16MB',spec:'SOP-8/W25Q128',unit:'个',qty:1,price:4.2,supplier:'华邦电子',status:'有效',level:2,icon:'⬛'},
      {id:'B-IC-20004',name:'以太网 PHY芯片',spec:'QFN-48/RTL8211F',unit:'个',qty:1,price:12.5,supplier:'瑞昱半导体',status:'有效',level:2,icon:'🌐'},
      {id:'B-R-20005',name:'贴片电阻套件',spec:'0402混装/100种',unit:'套',qty:1,price:1.5,supplier:'国巨电子',status:'有效',level:2,icon:'🔴'},
      {id:'B-C-20006',name:'贴片电容套件',spec:'0402-0805混装',unit:'套',qty:1,price:2.8,supplier:'三星电机',status:'有效',level:2,icon:'🟡'},
      {id:'B-CN-20007',name:'RJ45网口 双联',spec:'2x1/带LED/沉板',unit:'个',qty:1,price:6.8,supplier:'泰科电子',status:'有效',level:2,icon:'🔌'},
      {id:'B-CN-20008',name:'RJ45网口 单口',spec:'1x1/带LED/千兆',unit:'个',qty:3,price:3.5,supplier:'泰科电子',status:'有效',level:2,icon:'🔌'},
      {id:'B-USB-20009',name:'USB 2.0 Type-A母座',spec:'直插/4Pin',unit:'个',qty:1,price:0.8,supplier:'莫仕',status:'有效',level:2,icon:'🔌'},
      {id:'B-LED-20010',name:'指示灯 LED',spec:'0603/红绿蓝各2',unit:'个',qty:6,price:0.03,supplier:'亿光电子',status:'有效',level:2,icon:'💡'},
      {id:'B-X-20011',name:'晶振 25MHz',spec:'3225/25MHz±20ppm',unit:'个',qty:1,price:0.55,supplier:'泰晶科技',status:'有效',level:2,icon:'💎'},
      {id:'B-PWR-20012',name:'DC-DC模块 12V转3.3V',spec:'SOP-8/2A',unit:'个',qty:1,price:2.2,supplier:'圣邦微',status:'有效',level:2,icon:'⚡'},
      {id:'B-PWR-20013',name:'DC-DC模块 12V转1.8V',spec:'SOT-23-5/LDO',unit:'个',qty:1,price:0.8,supplier:'圣邦微',status:'有效',level:2,icon:'⚡'}
    ]},
    {id:'B-RF-10002',name:'WiFi模组',spec:'WiFi6-AX1800',unit:'个',qty:1,price:85,supplier:'乐鑫科技',status:'有效',level:1,icon:'📶',children:[
      {id:'B-RF-20020',name:'WiFi6芯片 MT7905D',spec:'QFN/2.4G+5G',unit:'个',qty:1,price:38.0,supplier:'联发科',status:'有效',level:2,icon:'📶'},
      {id:'B-RF-20021',name:'功率放大器 2.4G',spec:'QFN-16/+22dBm',unit:'个',qty:1,price:5.5,supplier:'卓胜微',status:'有效',level:2,icon:'📡'},
      {id:'B-RF-20022',name:'功率放大器 5G',spec:'QFN-16/+20dBm',unit:'个',qty:1,price:6.2,supplier:'卓胜微',status:'有效',level:2,icon:'📡'},
      {id:'B-RF-20023',name:'PCB天线 2.4G',spec:'内置/FPC/3dBi',unit:'个',qty:2,price:1.2,supplier:'信维通信',status:'有效',level:2,icon:'📡'},
      {id:'B-RF-20024',name:'PCB天线 5G',spec:'内置/FPC/4dBi',unit:'个',qty:2,price:1.5,supplier:'信维通信',status:'有效',level:2,icon:'📡'},
      {id:'B-RF-20025',name:'RF滤波器 BAW',spec:'0805/2.4GHz',unit:'个',qty:2,price:2.8,supplier:'中电55所',status:'待审',level:2,icon:'🔵'}
    ]},
    {id:'B-CASE-10003',name:'外壳组件',spec:'GW-CASE-V1',unit:'套',qty:1,price:45,supplier:'精模科技',status:'有效',level:1,icon:'🔧',children:[
      {id:'B-CS-20030',name:'上盖(ABS)',spec:'160x120x15mm/白色',unit:'个',qty:1,price:15.0,supplier:'精模科技',status:'有效',level:2,icon:'📐'},
      {id:'B-CS-20031',name:'底壳(ABS)',spec:'160x120x20mm/白色',unit:'个',qty:1,price:16.0,supplier:'精模科技',status:'有效',level:2,icon:'📐'},
      {id:'B-CS-20032',name:'散热栅格',spec:'铝合金/CNC/阳极黑',unit:'个',qty:1,price:8.5,supplier:'精模科技',status:'有效',level:2,icon:'🧊'},
      {id:'B-CS-20033',name:'螺丝 M2×5',spec:'304不锈钢/自攻',unit:'个',qty:8,price:0.04,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'},
      {id:'B-CS-20034',name:'脚垫',spec:'Φ8/硅胶/灰色',unit:'个',qty:4,price:0.05,supplier:'精模科技',status:'有效',level:2,icon:'⚫'}
    ]},
    {id:'B-PWR-10004',name:'电源适配器',spec:'12V2A-DC',unit:'个',qty:1,price:25,supplier:'航嘉驰源',status:'有效',level:1,icon:'⚡',children:[
      {id:'B-PA-20040',name:'12V2A适配器',spec:'DC5.5x2.1/Class II',unit:'个',qty:1,price:18.0,supplier:'航嘉驰源',status:'有效',level:2,icon:'🔌'},
      {id:'B-PA-20041',name:'DC电源插座',spec:'DC-005/5.5x2.1/贴片',unit:'个',qty:1,price:0.6,supplier:'韩荣电子',status:'有效',level:2,icon:'🔌'},
      {id:'B-PA-20042',name:'TVS保护管',spec:'SOD-123/15V/双向',unit:'个',qty:1,price:0.25,supplier:'长电科技',status:'有效',level:2,icon:'🛡'}
    ]},
    {id:'B-PKG-10005',name:'包装',spec:'GW-PKG',unit:'套',qty:1,price:8,supplier:'裕同包装',status:'有效',level:1,icon:'📦',children:[
      {id:'B-PK-20050',name:'彩盒',spec:'200x150x60mm/灰卡',unit:'个',qty:1,price:3.0,supplier:'裕同包装',status:'有效',level:2,icon:'📦'},
      {id:'B-PK-20051',name:'说明书',spec:'折页/铜版纸',unit:'本',qty:1,price:0.4,supplier:'永丰印务',status:'有效',level:2,icon:'📖'},
      {id:'B-PK-20052',name:'网线 1m',spec:'Cat5e/RJ45/灰色',unit:'条',qty:1,price:2.5,supplier:'绿联',status:'有效',level:2,icon:'〰️'}
    ]},
    {id:'B-ZB-10006',name:'Zigbee模组',spec:'ZB-3.0-CC2652',unit:'个',qty:1,price:35,supplier:'德州仪器',status:'有效',level:1,icon:'📡',children:[
      {id:'B-ZB-20060',name:'Zigbee 3.0芯片 CC2652R',spec:'QFN-48/Cortex-M4F',unit:'个',qty:1,price:15.0,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'B-ZB-20061',name:'2.4G天线',spec:'陶瓷/2.4GHz/1dBi',unit:'个',qty:1,price:0.8,supplier:'信维通信',status:'有效',level:2,icon:'📡'},
      {id:'B-ZB-20062',name:'晶振 48MHz',spec:'2016/±10ppm',unit:'个',qty:1,price:0.45,supplier:'泰晶科技',status:'有效',level:2,icon:'💎'},
      {id:'B-ZB-20063',name:'LDO 3.3V',spec:'SOT-23-5/300mA',unit:'个',qty:1,price:0.35,supplier:'圣邦微',status:'有效',level:2,icon:'⚡'},
      {id:'B-ZB-20064',name:'RF滤波匹配电路',spec:'0402/带通/2.4GHz',unit:'套',qty:1,price:0.2,supplier:'国巨电子',status:'有效',level:2,icon:'🔵'},
      {id:'B-ZB-20065',name:'Zigbee模组PCB',spec:'4层/FR4/15x18mm',unit:'块',qty:1,price:3.0,supplier:'深南电路',status:'有效',level:2,icon:'🟩'}
    ]},
    {id:'B-COOL-10007',name:'散热组件',spec:'GW-THERMAL',unit:'套',qty:1,price:15,supplier:'飞荣达',status:'有效',level:1,icon:'🧊',children:[
      {id:'B-HS-20070',name:'铝散热片(主芯片)',spec:'30x30x8mm/黑色阳极/翅片',unit:'个',qty:1,price:3.5,supplier:'飞荣达',status:'有效',level:2,icon:'🧊'},
      {id:'B-PAD-20071',name:'导热硅胶垫',spec:'30x30x0.5mm/8W/mK',unit:'片',qty:2,price:1.5,supplier:'飞荣达',status:'有效',level:2,icon:'🧊'},
      {id:'B-TAPE-20072',name:'石墨散热片',spec:'50x30x0.025mm/人工石墨',unit:'片',qty:1,price:2.0,supplier:'碳元科技',status:'有效',level:2,icon:'⬛'},
      {id:'B-FAN-20073',name:'微型散热风扇',spec:'30x30x7mm/5V/静音',unit:'个',qty:1,price:4.5,supplier:'建准电机',status:'待审',level:2,icon:'💨'}
    ]}
  ]
};
