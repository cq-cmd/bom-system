export const processRoutes = [
  {id:'PRC-001',name:'主板PCBA加工',product:'A100 整机',steps:[{name:'钢网印刷',type:'SMT',time:5},{name:'贴片',type:'SMT',time:15},{name:'回流焊',type:'SMT',time:8},{name:'AOI检测',type:'检测',time:3},{name:'DIP插件',type:'DIP',time:10},{name:'波峰焊',type:'DIP',time:6},{name:'ICT测试',type:'测试',time:5},{name:'功能测试',type:'测试',time:8}],status:'已发布',creator:'张工'},
  {id:'PRC-002',name:'整机组装',product:'A100 整机',steps:[{name:'主板安装',type:'组装',time:3},{name:'屏幕贴合',type:'组装',time:5},{name:'排线连接',type:'组装',time:4},{name:'外壳装配',type:'组装',time:6},{name:'整机测试',type:'测试',time:10},{name:'包装',type:'包装',time:3}],status:'已发布',creator:'李工'},
  {id:'PRC-003',name:'手环PCBA加工',product:'D400 手环',steps:[{name:'钢网印刷',type:'SMT',time:4},{name:'贴片',type:'SMT',time:12},{name:'回流焊',type:'SMT',time:7},{name:'X-Ray检测',type:'检测',time:5},{name:'功能测试',type:'测试',time:6}],status:'审核中',creator:'王主管'},
  {id:'PRC-004',name:'路由器组装',product:'R900 路由器',steps:[{name:'主板安装',type:'组装',time:4},{name:'天线焊接',type:'焊接',time:8},{name:'外壳装配',type:'组装',time:5},{name:'RF测试',type:'测试',time:12},{name:'老化测试',type:'测试',time:24},{name:'包装',type:'包装',time:2}],status:'草稿',creator:'张工'}
];
