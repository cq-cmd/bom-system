const avatar = seed => `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=ffedd5`;

export const demoUsers = [
  {name:'张工',account:'zhang',password:'123456',role:'高级工程师',initial:'张',email:'zhang.gong@example.com',avatar:avatar('zhang')},
  {name:'王主管',account:'wang',password:'123456',role:'研发主管',initial:'王',email:'wang.zhuguan@example.com',avatar:avatar('wang')},
  {name:'赵品质',account:'zhao',password:'123456',role:'品质工程师',initial:'赵',email:'zhao.pinzhi@example.com',avatar:avatar('zhao')},
  {name:'陈总监',account:'chen',password:'123456',role:'技术总监',initial:'陈',email:'chen.zongjian@example.com',avatar:avatar('chen')},
  {name:'李工',account:'li',password:'123456',role:'硬件工程师',initial:'李',email:'li.gong@example.com',avatar:avatar('li')},
  {name:'刘采购',account:'liu',password:'123456',role:'采购专员',initial:'刘',email:'liu.caigou@example.com',avatar:avatar('liu')},
  {name:'孙测试',account:'sun',password:'123456',role:'测试工程师',initial:'孙',email:'sun.ceshi@example.com',avatar:avatar('sun')},
  {name:'周结构',account:'zhou',password:'123456',role:'结构工程师',initial:'周',email:'zhou.jiegou@example.com',avatar:avatar('zhou')},
  {name:'吴射频',account:'wu',password:'123456',role:'射频工程师',initial:'吴',email:'wu.shepin@example.com',avatar:avatar('wu')},
  {name:'郑产品',account:'zheng',password:'123456',role:'产品经理',initial:'郑',email:'zheng.chanpin@example.com',avatar:avatar('zheng')}
];
