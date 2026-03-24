export const bomDataC300 = {
  id:'C300-00001',name:'工业传感器 C300',spec:'C300-IND-2025',unit:'台',qty:1,price:420,supplier:'—',status:'有效',level:0,icon:'🔬',
  children:[
    {id:'C-PCB-10001',name:'采集板',spec:'C3-ACQ-V2.0',unit:'块',qty:1,price:120,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'C-IC-20001',name:'MCU STM32L476',spec:'LQFP-64/低功耗',unit:'个',qty:1,price:18.5,supplier:'意法半导体',status:'有效',level:2,icon:'⬛'},
      {id:'C-ADC-20002',name:'24位ADC ADS1256',spec:'SSOP-28/8通道',unit:'个',qty:1,price:32.0,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'C-AMP-20003',name:'仪表放大器 INA128',spec:'SOP-8/精密',unit:'个',qty:4,price:12.0,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'C-REF-20004',name:'基准源 REF5050',spec:'SOP-8/5V/0.05%',unit:'个',qty:1,price:15.0,supplier:'德州仪器',status:'有效',level:2,icon:'⬛'},
      {id:'C-R-20005',name:'精密电阻套件',spec:'0603/0.1%/薄膜',unit:'套',qty:1,price:8.5,supplier:'威世',status:'有效',level:2,icon:'🔴'},
      {id:'C-C-20006',name:'MLCC低噪声套件',spec:'C0G/NPO混装',unit:'套',qty:1,price:5.2,supplier:'村田制作所',status:'有效',level:2,icon:'🟡'},
      {id:'C-OPT-20007',name:'数字隔离器 ISO7741',spec:'SOIC-16/4通道',unit:'个',qty:1,price:8.8,supplier:'德州仪器',status:'有效',level:2,icon:'🛡'},
      {id:'C-PWR-20008',name:'隔离DC-DC B0505S',spec:'SIP-4/5V转5V/1W',unit:'个',qty:1,price:12.0,supplier:'金升阳',status:'有效',level:2,icon:'⚡'}
    ]},
    {id:'C-SENS-10002',name:'探头组件',spec:'C3-PROBE-SET',unit:'套',qty:1,price:180,supplier:'—',status:'有效',level:1,icon:'🌡',children:[
      {id:'C-PT-20010',name:'PT100温度探头',spec:'A级/Φ3x50mm/三线制',unit:'个',qty:2,price:25.0,supplier:'西门子',status:'有效',level:2,icon:'🌡'},
      {id:'C-PR-20011',name:'压力变送器 4-20mA',spec:'0-1MPa/G1/4/316L',unit:'个',qty:1,price:85.0,supplier:'恩德斯豪斯',status:'有效',level:2,icon:'🔵'},
      {id:'C-FL-20012',name:'流量传感器',spec:'DN15/脉冲输出/黄铜',unit:'个',qty:1,price:45.0,supplier:'横河电机',status:'待审',level:2,icon:'💧'}
    ]},
    {id:'C-COM-10003',name:'通信模块',spec:'C3-COM-RS485+4G',unit:'个',qty:1,price:65,supplier:'—',status:'有效',level:1,icon:'📡',children:[
      {id:'C-RS-20020',name:'RS485收发器 MAX3485',spec:'SOP-8/半双工',unit:'个',qty:1,price:3.5,supplier:'美信半导体',status:'有效',level:2,icon:'🔌'},
      {id:'C-4G-20021',name:'4G模组 EC200S',spec:'LCC/Cat.1/移远',unit:'个',qty:1,price:38.0,supplier:'移远通信',status:'有效',level:2,icon:'📶'},
      {id:'C-SIM-20022',name:'Nano SIM卡座',spec:'推拉式/6Pin/贴片',unit:'个',qty:1,price:1.2,supplier:'泰科电子',status:'有效',level:2,icon:'📱'},
      {id:'C-ANT-20023',name:'4G全频天线',spec:'FPC/内置/全频段',unit:'个',qty:1,price:5.5,supplier:'信维通信',status:'有效',level:2,icon:'📡'}
    ]},
    {id:'C-CASE-10004',name:'工业外壳',spec:'C3-ENCL-IP65',unit:'个',qty:1,price:55,supplier:'威图',status:'有效',level:1,icon:'🔧',children:[
      {id:'C-EN-20030',name:'铝壳体',spec:'180x120x60mm/压铸/IP65',unit:'个',qty:1,price:35.0,supplier:'威图',status:'有效',level:2,icon:'📐'},
      {id:'C-EN-20031',name:'防水接头 M12',spec:'4Pin/IP67/公头',unit:'个',qty:3,price:4.5,supplier:'宾德',status:'有效',level:2,icon:'🔌'},
      {id:'C-EN-20032',name:'DIN导轨卡扣',spec:'35mm标准/PA66',unit:'个',qty:2,price:1.0,supplier:'菲尼克斯',status:'有效',level:2,icon:'📎'},
      {id:'C-EN-20033',name:'密封胶条',spec:'硅胶/IP65/定制',unit:'条',qty:1,price:3.5,supplier:'威图',status:'有效',level:2,icon:'⭕'}
    ]},
    {id:'C-TERM-10005',name:'接线端子组件',spec:'C3-TERMINAL',unit:'套',qty:1,price:28,supplier:'菲尼克斯',status:'有效',level:1,icon:'🔌',children:[
      {id:'C-TB-20040',name:'弹簧式接线端子 6位',spec:'PTSA 2.5/6/2.54/绿',unit:'个',qty:2,price:4.5,supplier:'菲尼克斯',status:'有效',level:2,icon:'🔌'},
      {id:'C-TB-20041',name:'插拔式接线端子 4位',spec:'MC 1.5/4/3.81/绿',unit:'套',qty:1,price:3.8,supplier:'菲尼克斯',status:'有效',level:2,icon:'🔌'},
      {id:'C-TB-20042',name:'保险丝座',spec:'5x20mm/250V/面板式',unit:'个',qty:2,price:1.2,supplier:'力特',status:'有效',level:2,icon:'⚡'},
      {id:'C-TB-20043',name:'保险丝 1A',spec:'5x20mm/慢断/陶瓷管',unit:'个',qty:2,price:0.35,supplier:'力特',status:'有效',level:2,icon:'⚡'},
      {id:'C-TB-20044',name:'防雷TVS管',spec:'SMA/24V/双向/600W',unit:'个',qty:4,price:1.5,supplier:'泰科电子',status:'待审',level:2,icon:'🛡'},
      {id:'C-TB-20045',name:'接地螺栓',spec:'M4/黄铜/镀镍/带垫片',unit:'个',qty:1,price:0.8,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'}
    ]},
    {id:'C-LABEL-10006',name:'认证标签组件',spec:'C3-CERT-LABEL',unit:'套',qty:1,price:5,supplier:'永丰印务',status:'有效',level:1,icon:'🏷',children:[
      {id:'C-LB-20050',name:'CE认证标签',spec:'30x15mm/PET/银底',unit:'张',qty:1,price:0.15,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'C-LB-20051',name:'FCC标签',spec:'30x15mm/PET/银底',unit:'张',qty:1,price:0.15,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'C-LB-20052',name:'产品序列号标签',spec:'40x20mm/热敏/可变数据',unit:'张',qty:1,price:0.08,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'C-LB-20053',name:'二维码溯源标签',spec:'25x25mm/PET/UV打印',unit:'张',qty:1,price:0.12,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'C-LB-20054',name:'铭牌',spec:'50x30mm/铝质/腐蚀填漆',unit:'张',qty:1,price:1.5,supplier:'永丰印务',status:'有效',level:2,icon:'🏷'},
      {id:'C-LB-20055',name:'防拆标签',spec:'20x10mm/VOID/银色',unit:'张',qty:2,price:0.3,supplier:'永丰印务',status:'有效',level:2,icon:'🔒'}
    ]}
  ]
};
