export const productConfigs = [
  {id:'CFG-A100',product:'A100 整机',variants:[{name:'标准版',sku:'A100-STD',ram:'4GB',storage:'64GB',color:'黑色',price:299},{name:'高配版',sku:'A100-PRO',ram:'8GB',storage:'128GB',color:'黑色',price:399},{name:'尊享版',sku:'A100-MAX',ram:'8GB',storage:'256GB',color:'白色',price:499}]},
  {id:'CFG-P12A',product:'P12A 手机',variants:[{name:'标准版',sku:'P12A-128',ram:'8GB',storage:'128GB',color:'星空黑',price:3999},{name:'Pro版',sku:'P12A-256',ram:'12GB',storage:'256GB',color:'远峰蓝',price:4999},{name:'Ultra版',sku:'P12A-512',ram:'16GB',storage:'512GB',color:'暗夜紫',price:6999}]},
  {id:'CFG-D400',product:'D400 手环',variants:[{name:'运动版',sku:'D400-SPT',sensor:'心率+血氧',strap:'硅胶',color:'黑色',price:199},{name:'时尚版',sku:'D400-FSH',sensor:'心率+血氧+体温',strap:'不锈钢',color:'银色',price:299}]}
];

export const optionalParts = [
  {group:'充电器',required:false,options:[{name:'5W充电器',id:'CHG-5W',price:15},{name:'18W快充',id:'CHG-18W',price:35},{name:'无(不含充电器)',id:'CHG-NONE',price:0}]},
  {group:'耳机',required:false,options:[{name:'有线耳机',id:'EAR-WIRE',price:12},{name:'TWS无线耳机',id:'EAR-TWS',price:89},{name:'无',id:'EAR-NONE',price:0}]},
  {group:'保护壳',required:false,options:[{name:'硅胶壳',id:'CASE-SIL',price:8},{name:'钢化膜+壳套装',id:'CASE-SET',price:25},{name:'无',id:'CASE-NONE',price:0}]},
  {group:'存储扩展',required:false,options:[{name:'无',id:'SD-NONE',price:0},{name:'64GB TF卡',id:'SD-64',price:39},{name:'128GB TF卡',id:'SD-128',price:69}]}
];
