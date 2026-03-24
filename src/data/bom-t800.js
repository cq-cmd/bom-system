export const bomDataT800 = {
  id:'T800-00001',name:'平板电脑 T800',spec:'T800-PAD-2025',unit:'台',qty:1,price:1680,supplier:'—',status:'有效',level:0,icon:'💻',
  children:[
    {id:'T-MB-10001',name:'主控板',spec:'T8-MB-V2.1',unit:'块',qty:1,price:520,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'T-SOC-20001',name:'SoC 天玑9300',spec:'TSMC 4nm/八核',unit:'个',qty:1,price:185.0,supplier:'联发科',status:'有效',level:2,icon:'⬛'},
      {id:'T-RAM-20002',name:'LPDDR5X 16GB',spec:'8533MHz/PoP',unit:'个',qty:1,price:58.0,supplier:'三星半导体',status:'有效',level:2,icon:'⬛'},
      {id:'T-UFS-20003',name:'UFS4.0 512GB',spec:'BGA-153/4Lane',unit:'个',qty:1,price:46.0,supplier:'东芝存储',status:'有效',level:2,icon:'💾'},
      {id:'T-PMIC-20004',name:'电源管理IC',spec:'WLP/12路输出',unit:'个',qty:1,price:16.5,supplier:'高通',status:'有效',level:2,icon:'⚡'},
      {id:'T-MODEM-20005',name:'5G Modem',spec:'Sub6+毫米波',unit:'个',qty:1,price:42.0,supplier:'高通',status:'有效',level:2,icon:'📶'},
      {id:'T-WIFI-20006',name:'WiFi 7 + BT 5.4',spec:'M.2封装/三频',unit:'个',qty:1,price:18.0,supplier:'博通',status:'有效',level:2,icon:'📡'},
      {id:'T-GNSS-20007',name:'定位芯片',spec:'L1+L5/双频',unit:'个',qty:1,price:4.2,supplier:'意法半导体',status:'有效',level:2,icon:'🛰'},
      {id:'T-AUDIO-20008',name:'智能功放 CS40L26',spec:'WLCSP/SmartAmp',unit:'个',qty:2,price:4.8,supplier:'Cirrus Logic',status:'有效',level:2,icon:'🔊'},
      {id:'T-PCB-20009',name:'HDI 主板',spec:'14层/Anylayer/0.35mm',unit:'块',qty:1,price:138.0,supplier:'鹏鼎控股',status:'有效',level:2,icon:'🟩'},
      {id:'T-ESD-20010',name:'ESD矩阵',spec:'01005/12通道',unit:'个',qty:6,price:0.2,supplier:'安世半导体',status:'有效',level:2,icon:'🛡'}
    ]},
    {id:'T-DISP-10002',name:'显示模组',spec:'12.1" 3K LTPO',unit:'个',qty:1,price:480,supplier:'京东方',status:'有效',level:1,icon:'🖥',children:[
      {id:'T-PNL-20020',name:'LTPO AMOLED 面板',spec:'3000×2000/120Hz',unit:'个',qty:1,price:320.0,supplier:'京东方',status:'有效',level:2,icon:'🖼'},
      {id:'T-DDIC-20021',name:'显示驱动IC',spec:'COF/MIPI-DSI 8Lane',unit:'个',qty:1,price:26.0,supplier:'集创北方',status:'有效',level:2,icon:'⬛'},
      {id:'T-TP-20022',name:'触控IC',spec:'QFN-80/十点触控',unit:'个',qty:1,price:9.5,supplier:'汇顶科技',status:'有效',level:2,icon:'👆'},
      {id:'T-COF-20023',name:'COF 柔性排线',spec:'0.3mm间距/60Pin',unit:'条',qty:1,price:5.5,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'T-OCA-20024',name:'OCA 光学胶',spec:'12.1寸/0.18mm',unit:'张',qty:1,price:6.2,supplier:'三利谱',status:'有效',level:2,icon:'📜'},
      {id:'T-COVER-20025',name:'盖板玻璃',spec:'康宁Victus2/2.5D',unit:'个',qty:1,price:28.0,supplier:'康宁',status:'有效',level:2,icon:'📐'},
      {id:'T-HINGE-20026',name:'磁吸键盘连接器',spec:'PogoPin×8/镀金',unit:'套',qty:1,price:8.0,supplier:'CFE',status:'有效',level:2,icon:'⚙️'}
    ]},
    {id:'T-BAT-10003',name:'电池模组',spec:'T8-2S-11000',unit:'组',qty:1,price:210,supplier:'ATL',status:'有效',level:1,icon:'🔋',children:[
      {id:'T-CELL-20030',name:'双串锂电芯',spec:'3.87V/11000mAh',unit:'组',qty:1,price:148.0,supplier:'ATL',status:'有效',level:2,icon:'🔋'},
      {id:'T-BMS-20031',name:'电池管理板',spec:'2S/10A/温控',unit:'个',qty:1,price:18.5,supplier:'中颖电子',status:'有效',level:2,icon:'🛡'},
      {id:'T-NTC-20032',name:'电池NTC',spec:'10KΩ/B3950/0402',unit:'个',qty:2,price:0.18,supplier:'芯海科技',status:'有效',level:2,icon:'🌡'},
      {id:'T-BFPC-20033',name:'电池柔性板',spec:'0.3mm/镀镍/10Pin',unit:'条',qty:1,price:6.5,supplier:'鹏鼎控股',status:'有效',level:2,icon:'〰️'},
      {id:'T-FOAM-20034',name:'防爆缓冲泡棉',spec:'EVA/定制刀模',unit:'套',qty:1,price:2.8,supplier:'裕同包装',status:'有效',level:2,icon:'🧽'}
    ]},
    {id:'T-CAM-10004',name:'摄像头系统',spec:'CAM-Dual-13MP',unit:'套',qty:1,price:140,supplier:'—',status:'有效',level:1,icon:'📸',children:[
      {id:'T-REAR-20040',name:'后摄 1300万',spec:'IMX766/1/1.56"',unit:'个',qty:1,price:48.0,supplier:'索尼',status:'有效',level:2,icon:'📸'},
      {id:'T-FRONT-20041',name:'前摄 1000万',spec:'OV10D1/1.22μm',unit:'个',qty:1,price:18.0,supplier:'豪威科技',status:'有效',level:2,icon:'📸'},
      {id:'T-LENS-20042',name:'后摄镜头组 6P',spec:'f/1.9/84°',unit:'组',qty:1,price:14.0,supplier:'大立光电',status:'有效',level:2,icon:'🔍'},
      {id:'T-LENS-20043',name:'前摄镜头组 4P',spec:'f/2.2/广角',unit:'组',qty:1,price:6.5,supplier:'舜宇光学',status:'有效',level:2,icon:'🔍'},
      {id:'T-FPC-20044',name:'摄像头FPC',spec:'主+副/共用',unit:'套',qty:1,price:5.5,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'T-OIS-20045',name:'OIS 马达',spec:'闭环VCM',unit:'个',qty:1,price:12.0,supplier:'TDK',status:'待审',level:2,icon:'⚙️'}
    ]},
    {id:'T-CASE-10005',name:'结构件组件',spec:'T8-STRUCT',unit:'套',qty:1,price:260,supplier:'比亚迪电子',status:'有效',level:1,icon:'📐',children:[
      {id:'T-FRAME-20050',name:'一体式中框',spec:'CNC/镁铝合金',unit:'个',qty:1,price:95.0,supplier:'比亚迪电子',status:'有效',level:2,icon:'📐'},
      {id:'T-BACK-20051',name:'背板(陶瓷喷漆)',spec:'氧化锆/磨砂',unit:'个',qty:1,price:58.0,supplier:'潮州三环',status:'有效',level:2,icon:'📐'},
      {id:'T-KICK-20052',name:'可调支架',spec:'铝合金/多角度',unit:'个',qty:1,price:26.0,supplier:'精模科技',status:'有效',level:2,icon:'🦿'},
      {id:'T-SIM-20053',name:'SIM卡托+eSIM',spec:'铝合金/防水',unit:'套',qty:1,price:4.2,supplier:'比亚迪电子',status:'有效',level:2,icon:'📱'},
      {id:'T-HOLE-20054',name:'PogoPin 磁吸接口',spec:'8Pin/磁吸/黑色',unit:'套',qty:1,price:11.0,supplier:'CFE',status:'有效',level:2,icon:'🧲'},
      {id:'T-GASKET-20055',name:'防水密封胶圈',spec:'IP68/硅胶',unit:'套',qty:1,price:6.5,supplier:'精模科技',status:'有效',level:2,icon:'⭕'}
    ]},
    {id:'T-AUDIO-10006',name:'声学系统',spec:'Quad Speaker',unit:'套',qty:1,price:95,supplier:'歌尔股份',status:'有效',level:1,icon:'🔊',children:[
      {id:'T-SPK-20060',name:'长条扬声器 1216',spec:'线性/2对',unit:'个',qty:4,price:8.5,supplier:'歌尔股份',status:'有效',level:2,icon:'🔊'},
      {id:'T-MIC-20061',name:'MEMS 四麦阵列',spec:'PDM/防水网',unit:'个',qty:4,price:1.8,supplier:'瑞声科技',status:'有效',level:2,icon:'🎤'},
      {id:'T-AMP-20062',name:'四声道功放',spec:'Class-D/10W',unit:'个',qty:2,price:6.5,supplier:'德州仪器',status:'有效',level:2,icon:'🎚'},
      {id:'T-BASS-20063',name:'低频导波管',spec:'TPU/定制',unit:'套',qty:2,price:3.2,supplier:'飞荣达',status:'有效',level:2,icon:'〰️'}
    ]},
    {id:'T-IO-10007',name:'连接与扩展',spec:'T8-IO-SET',unit:'套',qty:1,price:60,supplier:'立讯精密',status:'有效',level:1,icon:'🔌',children:[
      {id:'T-TYPEC-20070',name:'Type-C 端口',spec:'USB4/PD3.1/沉板',unit:'个',qty:1,price:6.8,supplier:'立讯精密',status:'有效',level:2,icon:'🔌'},
      {id:'T-USB-20071',name:'USB-C Hub连接排线',spec:'0.25mm/50Pin',unit:'条',qty:1,price:3.5,supplier:'鹏鼎控股',status:'有效',level:2,icon:'〰️'},
      {id:'T-SENSE-20072',name:'指纹电容传感器',spec:'电源键一体',unit:'个',qty:1,price:5.5,supplier:'汇顶科技',status:'有效',level:2,icon:'🔒'},
      {id:'T-DOCK-20073',name:'磁吸键盘接口',spec:'PogoPin×14/磁吸',unit:'套',qty:1,price:8.5,supplier:'CFE',status:'有效',level:2,icon:'⌨️'},
      {id:'T-HALL-20074',name:'霍尔传感器',spec:'SOT-23/翻盖检测',unit:'个',qty:2,price:0.35,supplier:'旭化成',status:'有效',level:2,icon:'🧲'},
      {id:'T-BRIDGE-20075',name:'USB桥接IC',spec:'PCIe转USB4',unit:'个',qty:1,price:12.0,supplier:'德州仪器',status:'待审',level:2,icon:'🌉'}
    ]},
    {id:'T-PWR-10008',name:'充电与电源',spec:'GaN 80W',unit:'套',qty:1,price:120,supplier:'安克创新',status:'有效',level:1,icon:'🔋',children:[
      {id:'T-GAN-20080',name:'80W 氮化镓充电器',spec:'PD3.1/可折叠',unit:'个',qty:1,price:78.0,supplier:'安克创新',status:'有效',level:2,icon:'⚡'},
      {id:'T-CABLE-20081',name:'Type-C 编织线',spec:'1.5m/240W/E-Marker',unit:'条',qty:1,price:16.0,supplier:'绿联',status:'有效',level:2,icon:'〰️'},
      {id:'T-DOCK-20082',name:'桌面扩展坞',spec:'6口/金属外壳',unit:'个',qty:1,price:22.0,supplier:'摩米士',status:'待审',level:2,icon:'🧩'}
    ]},
    {id:'T-PKG-10009',name:'包装附件',spec:'T8-PKG',unit:'套',qty:1,price:45,supplier:'裕同包装',status:'有效',level:1,icon:'📦',children:[
      {id:'T-BOX-20090',name:'磁吸礼盒',spec:'310×210×60mm/银卡',unit:'个',qty:1,price:16.0,supplier:'裕同包装',status:'有效',level:2,icon:'📦'},
      {id:'T-FOAM-20091',name:'EVA 内衬',spec:'定制 CNC/黑色',unit:'套',qty:1,price:5.5,supplier:'裕同包装',status:'有效',level:2,icon:'🧽'},
      {id:'T-DOC-20092',name:'快速入门+保修卡',spec:'A5/四色印刷',unit:'套',qty:1,price:1.2,supplier:'永丰印务',status:'有效',level:2,icon:'📖'},
      {id:'T-FILM-20093',name:'出厂贴膜',spec:'PET/高清/12.1"',unit:'张',qty:1,price:1.0,supplier:'蓝思科技',status:'有效',level:2,icon:'📜'},
      {id:'T-PEN-20094',name:'磁吸触控笔',spec:'4096级压感/Type-C',unit:'支',qty:1,price:21.5,supplier:'比亚迪电子',status:'有效',level:2,icon:'🖊'}
    ]}
  ]
};
