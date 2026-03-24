export const bomDataF100 = {
  id:'F100-00001',name:'折叠屏手机 F100',spec:'F100-FOLD-2025',unit:'台',qty:1,price:6980,supplier:'—',status:'有效',level:0,icon:'📱',
  children:[
    {id:'F-MB-10001',name:'主板 PCBA',spec:'F1-MB-V1.0',unit:'块',qty:1,price:980,supplier:'华芯电子',status:'有效',level:1,icon:'🔧',children:[
      {id:'F-SOC-20001',name:'SoC 骁龙8 Gen3',spec:'FCBGA/4nm/8核',unit:'个',qty:1,price:380.0,supplier:'高通',status:'有效',level:2,icon:'⬛'},
      {id:'F-RAM-20002',name:'LPDDR5X 16GB',spec:'PoP/8533MHz/双通道',unit:'个',qty:1,price:58.0,supplier:'三星半导体',status:'有效',level:2,icon:'⬛'},
      {id:'F-UFS-20003',name:'UFS 4.0 512GB',spec:'BGA-153/2Lane',unit:'个',qty:1,price:65.0,supplier:'SK海力士',status:'有效',level:2,icon:'⬛'},
      {id:'F-PM-20004',name:'电源管理IC PM8550',spec:'WLP/多路输出',unit:'个',qty:1,price:18.5,supplier:'高通',status:'有效',level:2,icon:'⬛'},
      {id:'F-RF-20005',name:'5G射频前端',spec:'QFN/Sub-6GHz',unit:'个',qty:1,price:65.0,supplier:'高通',status:'有效',level:2,icon:'📡'},
      {id:'F-WF-20006',name:'WiFi 7芯片',spec:'QFN/WiFi7+BT5.3',unit:'个',qty:1,price:15.0,supplier:'高通',status:'有效',level:2,icon:'📶'},
      {id:'F-UWB-20007',name:'UWB芯片 SR150',spec:'QFN/6.5-8GHz/测距',unit:'个',qty:1,price:8.0,supplier:'恩智浦',status:'待审',level:2,icon:'📡'},
      {id:'F-CHG-20008',name:'快充IC 67W',spec:'QFN/2:1电荷泵',unit:'个',qty:1,price:5.8,supplier:'南芯科技',status:'有效',level:2,icon:'⚡'},
      {id:'F-R-20009',name:'贴片电阻套件',spec:'01005-0201/600种',unit:'套',qty:1,price:3.0,supplier:'国巨电子',status:'有效',level:2,icon:'🔴'},
      {id:'F-C-20010',name:'贴片电容套件',spec:'01005-0402/MLCC',unit:'套',qty:1,price:5.5,supplier:'村田制作所',status:'有效',level:2,icon:'🟡'},
      {id:'F-PCB-20011',name:'HDI主板(异形)',spec:'10层/Anylayer/异形切割',unit:'块',qty:1,price:95.0,supplier:'鹏鼎控股',status:'有效',level:2,icon:'🟩'}
    ]},
    {id:'F-DISP-10002',name:'折叠内屏模组',spec:'FOLDABLE-7.6',unit:'个',qty:1,price:1280,supplier:'三星显示',status:'有效',level:1,icon:'🖥',children:[
      {id:'F-IPNL-20020',name:'折叠OLED面板 7.6寸',spec:'LTPO/2K+/120Hz/UTG',unit:'个',qty:1,price:680.0,supplier:'三星显示',status:'有效',level:2,icon:'🖼'},
      {id:'F-UTG-20021',name:'超薄玻璃盖板 UTG',spec:'30μm/可折叠/AF镀膜',unit:'张',qty:1,price:120.0,supplier:'肖特',status:'有效',level:2,icon:'📐'},
      {id:'F-IDDIC-20022',name:'内屏驱动IC',spec:'COF/MIPI/可变刷新',unit:'个',qty:1,price:35.0,supplier:'三星LSI',status:'有效',level:2,icon:'⬛'},
      {id:'F-ITP-20023',name:'内屏触控IC',spec:'QFN/多点/折叠补偿',unit:'个',qty:1,price:12.0,supplier:'汇顶科技',status:'有效',level:2,icon:'👆'},
      {id:'F-IFPC-20024',name:'内屏FPC(可折叠)',spec:'MPI/超柔/弯折寿命20万次',unit:'条',qty:1,price:25.0,supplier:'鹏鼎控股',status:'有效',level:2,icon:'〰️'},
      {id:'F-FILM-20025',name:'折叠保护膜',spec:'CPI/自修复/预贴',unit:'张',qty:1,price:15.0,supplier:'科隆精化',status:'有效',level:2,icon:'📜'},
      {id:'F-IOCA-20026',name:'可折叠OCA',spec:'特种/低模量/弯折20万次',unit:'张',qty:1,price:18.0,supplier:'三利谱',status:'有效',level:2,icon:'📜'}
    ]},
    {id:'F-ODISP-10003',name:'外屏模组',spec:'AMOLED-6.2-COVER',unit:'个',qty:1,price:280,supplier:'三星显示',status:'有效',level:1,icon:'🖥',children:[
      {id:'F-OPNL-20030',name:'外屏AMOLED 6.2寸',spec:'FHD+/120Hz/LTPO',unit:'个',qty:1,price:160.0,supplier:'三星显示',status:'有效',level:2,icon:'🖼'},
      {id:'F-ODDIC-20031',name:'外屏驱动IC',spec:'COF/MIPI',unit:'个',qty:1,price:18.0,supplier:'三星LSI',status:'有效',level:2,icon:'⬛'},
      {id:'F-OTP-20032',name:'外屏触控IC',spec:'QFN-48/超窄边框',unit:'个',qty:1,price:6.5,supplier:'汇顶科技',status:'有效',level:2,icon:'👆'},
      {id:'F-OCG-20033',name:'外屏盖板(大猩猩)',spec:'Victus2/0.4mm/2.5D',unit:'个',qty:1,price:32.0,supplier:'康宁',status:'有效',level:2,icon:'📐'},
      {id:'F-OFPC-20034',name:'外屏FPC',spec:'40Pin/0.3mm间距',unit:'条',qty:1,price:5.0,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'},
      {id:'F-OFP-20035',name:'外屏屏下指纹',spec:'光学/超薄/0.8mm',unit:'个',qty:1,price:15.0,supplier:'汇顶科技',status:'有效',level:2,icon:'🔒'}
    ]},
    {id:'F-HINGE-10004',name:'铰链模组',spec:'F1-HINGE-V3',unit:'个',qty:1,price:580,supplier:'精模科技',status:'有效',level:1,icon:'⚙️',children:[
      {id:'F-HG-20040',name:'水滴铰链主体',spec:'液态金属/CNC/114零件',unit:'组',qty:1,price:320.0,supplier:'精模科技',status:'有效',level:2,icon:'⚙️'},
      {id:'F-CAM-20041',name:'铰链凸轮组件',spec:'MIM/17-4PH/配对研磨',unit:'套',qty:1,price:65.0,supplier:'精研科技',status:'有效',level:2,icon:'⚙️'},
      {id:'F-SHAFT-20042',name:'主转轴',spec:'钛合金/Φ3.5mm/精磨',unit:'根',qty:1,price:35.0,supplier:'精模科技',status:'有效',level:2,icon:'⚙️'},
      {id:'F-SPRING-20043',name:'恒力弹簧组',spec:'不锈钢/定制/配对',unit:'套',qty:1,price:18.0,supplier:'精模科技',status:'有效',level:2,icon:'⚙️'},
      {id:'F-PLATE-20044',name:'铰链支撑板',spec:'液态金属/Zr基/非晶',unit:'个',qty:2,price:28.0,supplier:'宜安科技',status:'有效',level:2,icon:'📐'},
      {id:'F-COVER-20045',name:'铰链装饰盖',spec:'不锈钢/PVD/镜面',unit:'个',qty:2,price:5.0,supplier:'比亚迪电子',status:'有效',level:2,icon:'📐'},
      {id:'F-BRUSH-20046',name:'防尘刷',spec:'尼龙/植毛/铰链内侧',unit:'条',qty:2,price:1.5,supplier:'精模科技',status:'有效',level:2,icon:'🧹'}
    ]},
    {id:'F-BAT-10005',name:'双电池组件',spec:'F1-BAT-DUAL',unit:'组',qty:1,price:120,supplier:'ATL',status:'有效',level:1,icon:'🔋',children:[
      {id:'F-CELL1-20050',name:'上半电池',spec:'3.87V/2300mAh/异形',unit:'个',qty:1,price:32.0,supplier:'ATL',status:'有效',level:2,icon:'🔋'},
      {id:'F-CELL2-20051',name:'下半电池',spec:'3.87V/2700mAh/异形',unit:'个',qty:1,price:38.0,supplier:'ATL',status:'有效',level:2,icon:'🔋'},
      {id:'F-BMS-20052',name:'双电池管理IC',spec:'QFN/2S1P/均衡',unit:'个',qty:1,price:6.5,supplier:'德州仪器',status:'有效',level:2,icon:'🛡'},
      {id:'F-BFPC-20053',name:'电池FPC(跨铰链)',spec:'MPI/超柔/可折叠',unit:'条',qty:1,price:12.0,supplier:'鹏鼎控股',status:'有效',level:2,icon:'〰️'},
      {id:'F-NTC-20054',name:'NTC热敏电阻',spec:'10KΩ/贴肤/双路',unit:'个',qty:2,price:0.15,supplier:'芯海科技',status:'有效',level:2,icon:'🌡'}
    ]},
    {id:'F-CAM-10006',name:'摄像头模组',spec:'F1-CAM-TRIPLE',unit:'套',qty:1,price:280,supplier:'—',status:'有效',level:1,icon:'📸',children:[
      {id:'F-MCAM-20060',name:'主摄CMOS IMX890',spec:'1/1.56寸/5000万/OIS',unit:'个',qty:1,price:65.0,supplier:'索尼',status:'有效',level:2,icon:'📸'},
      {id:'F-UCAM-20061',name:'超广角CMOS IMX581',spec:'1/2.76寸/4800万',unit:'个',qty:1,price:22.0,supplier:'索尼',status:'有效',level:2,icon:'📸'},
      {id:'F-TCAM-20062',name:'长焦CMOS OV13B',spec:'1/3.06寸/1300万/2x',unit:'个',qty:1,price:12.0,supplier:'豪威科技',status:'有效',level:2,icon:'📸'},
      {id:'F-FCAM-20063',name:'前摄(内屏下)',spec:'UDC/400万/f/1.8',unit:'个',qty:1,price:8.0,supplier:'三星LSI',status:'有效',level:2,icon:'📸'},
      {id:'F-FCAM2-20064',name:'前摄(外屏)',spec:'1/3.4寸/1000万/AF',unit:'个',qty:1,price:6.5,supplier:'索尼',status:'有效',level:2,icon:'📸'},
      {id:'F-LENS-20065',name:'主摄镜头组 7P',spec:'f/1.8/7片/非球面',unit:'组',qty:1,price:15.0,supplier:'大立光电',status:'有效',level:2,icon:'🔍'},
      {id:'F-CFPC-20066',name:'摄像头FPC',spec:'多路/0.25mm间距',unit:'套',qty:1,price:12.0,supplier:'立讯精密',status:'有效',level:2,icon:'〰️'}
    ]},
    {id:'F-STRUCT-10007',name:'结构件',spec:'F1-STRUCT',unit:'套',qty:1,price:450,supplier:'比亚迪电子',status:'有效',level:1,icon:'📐',children:[
      {id:'F-FRAME1-20070',name:'上半中框',spec:'铝合金/CNC/阳极',unit:'个',qty:1,price:55.0,supplier:'比亚迪电子',status:'有效',level:2,icon:'📐'},
      {id:'F-FRAME2-20071',name:'下半中框',spec:'铝合金/CNC/阳极',unit:'个',qty:1,price:55.0,supplier:'比亚迪电子',status:'有效',level:2,icon:'📐'},
      {id:'F-BACK-20072',name:'后盖(素皮)',spec:'超纤皮革/环保/黑色',unit:'个',qty:1,price:28.0,supplier:'延锋内饰',status:'有效',level:2,icon:'📐'},
      {id:'F-SPK-20073',name:'立体声扬声器',spec:'0711/0.5W/双单元',unit:'个',qty:2,price:4.0,supplier:'歌尔股份',status:'有效',level:2,icon:'🔊'},
      {id:'F-VIB-20074',name:'X轴线性马达',spec:'LRA/Taptic/1036',unit:'个',qty:1,price:10.0,supplier:'瑞声科技',status:'有效',level:2,icon:'📳'},
      {id:'F-SIM-20075',name:'eSIM芯片',spec:'QFN/嵌入式/5x6mm',unit:'个',qty:1,price:3.5,supplier:'泰雷兹',status:'有效',level:2,icon:'📱'},
      {id:'F-SEAL-20076',name:'防水密封套件',spec:'IPX8/硅胶/铰链特殊',unit:'套',qty:1,price:12.0,supplier:'精模科技',status:'有效',level:2,icon:'⭕'},
      {id:'F-SCREW-20077',name:'螺丝套件',spec:'T2/多规格/钛合金',unit:'套',qty:1,price:2.0,supplier:'标准件厂',status:'有效',level:2,icon:'🔩'}
    ]},
    {id:'F-PKG-10008',name:'包装附件',spec:'F1-PKG-PREMIUM',unit:'套',qty:1,price:85,supplier:'裕同包装',status:'有效',level:1,icon:'📦',children:[
      {id:'F-BOX-20080',name:'精装磁吸礼盒',spec:'200x160x55mm/翻盖/烫金',unit:'个',qty:1,price:28.0,supplier:'裕同包装',status:'有效',level:2,icon:'📦'},
      {id:'F-CHG-20081',name:'67W GaN充电器',spec:'Type-C/PD3.0/折叠插脚',unit:'个',qty:1,price:22.0,supplier:'安克创新',status:'有效',level:2,icon:'⚡'},
      {id:'F-CBL-20082',name:'Type-C数据线',spec:'1m/E-Marker/编织',unit:'条',qty:1,price:6.0,supplier:'绿联',status:'有效',level:2,icon:'〰️'},
      {id:'F-PCASE-20083',name:'保护壳(铰链兼容)',spec:'PC+TPU/半包/磨砂',unit:'个',qty:1,price:8.0,supplier:'比亚迪电子',status:'有效',level:2,icon:'📱'},
      {id:'F-DOC-20084',name:'说明书套装',spec:'精装/多语言/AR引导',unit:'套',qty:1,price:2.0,supplier:'永丰印务',status:'有效',level:2,icon:'📖'}
    ]}
  ]
};
