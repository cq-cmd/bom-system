export const bomDataH200 = {
  id:'H200-00001',name:'智能家居网关 H200',spec:'H200-HUB-2025',unit:'台',qty:1,price:820,supplier:'—',status:'有效',level:0,icon:'🏠',
  children:[
    {id:'H-CORE-10001',name:'核心主板',spec:'H2-CORE-V1.3',unit:'块',qty:1,price:260,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'H-CPU-20001',name:'SoC NXP i.MX93',spec:'NPU内置/双核A55',unit:'个',qty:1,price:58.0,supplier:'恩智浦',status:'有效',level:2,icon:'⬛'},
      {id:'H-RAM-20002',name:'DDR4 4GB',spec:'BGA-96/3200MHz',unit:'个',qty:1,price:18.5,supplier:'美光',status:'有效',level:2,icon:'⬛'},
      {id:'H-EMMC-20003',name:'eMMC 64GB',spec:'BGA-153/HS400',unit:'个',qty:1,price:16.0,supplier:'闪迪',status:'有效',level:2,icon:'💾'},
      {id:'H-SEC-20004',name:'安全芯片 ATECC608',spec:'UDFN-8/安全启动',unit:'个',qty:1,price:3.8,supplier:'Microchip',status:'有效',level:2,icon:'🔒'},
      {id:'H-LAN-20005',name:'千兆以太网 PHY',spec:'QFN-48/RTL8211',unit:'个',qty:1,price:8.2,supplier:'瑞昱半导体',status:'有效',level:2,icon:'🌐'},
      {id:'H-PCB-20006',name:'8层主板',spec:'1.2mm/沉金/阻抗控',unit:'块',qty:1,price:42.0,supplier:'深南电路',status:'有效',level:2,icon:'🟩'},
      {id:'H-TMP-20007',name:'板载温度传感器',spec:'I2C/±0.2℃',unit:'个',qty:1,price:0.65,supplier:'德州仪器',status:'有效',level:2,icon:'🌡'}
    ]},
    {id:'H-COMM-10002',name:'无线通信模组',spec:'Thread/Zigbee/WiFi',unit:'套',qty:1,price:180,supplier:'乐鑫科技',status:'有效',level:1,icon:'📡',children:[
      {id:'H-WIFI-20010',name:'WiFi 6E 芯片 ESP32-C6',spec:'QFN-40/BT5.4',unit:'个',qty:1,price:14.0,supplier:'乐鑫科技',status:'有效',level:2,icon:'📶'},
      {id:'H-THREAD-20011',name:'Thread/BLE 芯片 EFR32MG24',spec:'QFN-48/Matter',unit:'个',qty:1,price:12.5,supplier:'Silicon Labs',status:'有效',level:2,icon:'🧵'},
      {id:'H-ZB-20012',name:'Zigbee 3.0 模块',spec:'LGA/20dBm',unit:'个',qty:1,price:11.0,supplier:'TI',status:'有效',level:2,icon:'🕸'},
      {id:'H-UWB-20013',name:'UWB 定位模块',spec:'Decawave DW3000',unit:'个',qty:1,price:26.0,supplier:'Qorvo',status:'待审',level:2,icon:'📡'},
      {id:'H-ANT-20014',name:'多频天线阵列',spec:'FPC/LDS/2.4+5G+6E',unit:'套',qty:1,price:9.8,supplier:'信维通信',status:'有效',level:2,icon:'🛰'},
      {id:'H-FILTER-20015',name:'射频滤波阵列',spec:'0402/SAW/多通道',unit:'组',qty:1,price:5.5,supplier:'中电55所',status:'有效',level:2,icon:'🔵'}
    ]},
    {id:'H-IO-10003',name:'边缘接口板',spec:'H2-EDGE-V1.0',unit:'块',qty:1,price:95,supplier:'立讯精密',status:'有效',level:1,icon:'🔌',children:[
      {id:'H-POGO-20020',name:'PogoPin 接口阵列',spec:'32Pin/镀金',unit:'套',qty:1,price:14.5,supplier:'CFE',status:'有效',level:2,icon:'📎'},
      {id:'H-REL-20021',name:'可插拔继电器',spec:'250VAC/10A',unit:'个',qty:3,price:6.8,supplier:'松下电工',status:'有效',level:2,icon:'⚙️'},
      {id:'H-IOEXP-20022',name:'IO 扩展IC',spec:'SPI→16 GPIO',unit:'个',qty:2,price:2.4,supplier:'德州仪器',status:'有效',level:2,icon:'🔀'},
      {id:'H-USB-20023',name:'USB 2.0 Host 接口',spec:'Type-A/双口',unit:'套',qty:1,price:3.2,supplier:'莫仕',status:'有效',level:2,icon:'🔌'},
      {id:'H-LED-20024',name:'状态灯板',spec:'RGB LED×4/共阴',unit:'套',qty:1,price:2.1,supplier:'亿光电子',status:'有效',level:2,icon:'💡'},
      {id:'H-SD-20025',name:'MicroSD 卡座',spec:'推拉/自弹',unit:'个',qty:1,price:1.6,supplier:'泰科电子',status:'有效',level:2,icon:'💾'}
    ]},
    {id:'H-PWR-10004',name:'电源与备份',spec:'H2-PWR-UPS',unit:'套',qty:1,price:110,supplier:'航嘉驰源',status:'有效',level:1,icon:'🔋',children:[
      {id:'H-PSU-20030',name:'AC-DC 模块 24W',spec:'90-264VAC→12V2A',unit:'个',qty:1,price:28.0,supplier:'航嘉驰源',status:'有效',level:2,icon:'⚡'},
      {id:'H-DC-20031',name:'DC-DC 双路模块',spec:'12V→5V/3.3V/同步整流',unit:'套',qty:1,price:12.5,supplier:'矽力杰',status:'有效',level:2,icon:'⚡'},
      {id:'H-BACKUP-20032',name:'超级电容 UPS',spec:'10F×2/热插拔',unit:'套',qty:1,price:22.0,supplier:'村田制作所',status:'有效',level:2,icon:'🔋'},
      {id:'H-SENSOR-20033',name:'电流检测模块',spec:'毫欧采样/隔离',unit:'个',qty:1,price:5.2,supplier:'艾默生',status:'有效',level:2,icon:'📏'},
      {id:'H-FUSE-20034',name:'自恢复保险丝',spec:'PTC/2.5A',unit:'个',qty:2,price:0.65,supplier:'力特',status:'有效',level:2,icon:'🛡'}
    ]},
    {id:'H-SENSE-10005',name:'监测与交互',spec:'H2-SENSE',unit:'套',qty:1,price:55,supplier:'—',status:'有效',level:1,icon:'🧭',children:[
      {id:'H-ENV-20040',name:'环境传感板',spec:'温湿度+VOC+噪声',unit:'套',qty:1,price:12.0,supplier:'盛思锐',status:'有效',level:2,icon:'🌫'},
      {id:'H-TOF-20041',name:'前面板 dToF 传感器',spec:'VCSEL+SPAD',unit:'个',qty:1,price:6.5,supplier:'意法半导体',status:'有效',level:2,icon:'🔦'},
      {id:'H-LIGHT-20042',name:'多色状态灯条',spec:'ARGB/12颗',unit:'条',qty:1,price:4.5,supplier:'亿光电子',status:'有效',level:2,icon:'🌈'},
      {id:'H-MIC-20043',name:'远场麦克风阵列',spec:'4麦/波束成形',unit:'套',qty:1,price:15.0,supplier:'歌尔股份',status:'有效',level:2,icon:'🎤'},
      {id:'H-BTN-20044',name:'触控按键 PCB',spec:'电容式/玻璃覆层',unit:'套',qty:1,price:3.8,supplier:'东山精密',status:'有效',level:2,icon:'🔘'}
    ]},
    {id:'H-CASE-10006',name:'机壳与散热',spec:'H2-ENCLOSURE',unit:'套',qty:1,price:140,supplier:'精模科技',status:'有效',level:1,icon:'📦',children:[
      {id:'H-SHELL-20050',name:'铝合金外壳',spec:'挤压+喷砂+阳极',unit:'个',qty:1,price:58.0,supplier:'精模科技',status:'有效',level:2,icon:'📐'},
      {id:'H-BTM-20051',name:'底盖(钢板+散热鳍片)',spec:'CNC/导热硅脂',unit:'个',qty:1,price:32.0,supplier:'飞荣达',status:'有效',level:2,icon:'🧊'},
      {id:'H-VESA-20052',name:'壁挂支架',spec:'VESA75/快拆',unit:'套',qty:1,price:12.5,supplier:'绿联',status:'有效',level:2,icon:'🪛'},
      {id:'H-FAN-20053',name:'静音风扇 60×10',spec:'PWM/5000rpm',unit:'个',qty:1,price:9.8,supplier:'建准电机',status:'有效',level:2,icon:'💨'},
      {id:'H-GASKET-20054',name:'阻燃密封垫',spec:'UL94 V0/黑色泡棉',unit:'套',qty:1,price:4.2,supplier:'东海橡胶',status:'有效',level:2,icon:'⭕'}
    ]},
    {id:'H-PKG-10007',name:'包装与附件',spec:'H2-PKG',unit:'套',qty:1,price:30,supplier:'裕同包装',status:'有效',level:1,icon:'🎁',children:[
      {id:'H-BOX-20060',name:'抽屉式包装盒',spec:'260×210×90mm/牛卡',unit:'个',qty:1,price:9.0,supplier:'裕同包装',status:'有效',level:2,icon:'📦'},
      {id:'H-INSERT-20061',name:'EPE 定制内衬',spec:'黑色/双层',unit:'套',qty:1,price:3.5,supplier:'裕同包装',status:'有效',level:2,icon:'🧽'},
      {id:'H-ADPT-20062',name:'12V 适配器',spec:'国标/UL认证',unit:'个',qty:1,price:12.0,supplier:'航嘉驰源',status:'有效',level:2,icon:'🔌'},
      {id:'H-CABLE-20063',name:'以太网线 1.5m',spec:'Cat6/无氧铜',unit:'条',qty:1,price:2.8,supplier:'绿联',status:'有效',level:2,icon:'〰️'},
      {id:'H-DOC-20064',name:'快速上手+保修卡',spec:'A6/双语',unit:'套',qty:1,price:0.9,supplier:'永丰印务',status:'有效',level:2,icon:'📖'}
    ]}
  ]
};
