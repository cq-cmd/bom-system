export const approvals = [
  {id:'APR-2025-005',ver:'V3.0',applicant:'张工',date:'2025-06-15',node:'品质审核',status:'待审批',statusClass:'badge-yellow',
   timeline:[
     {title:'提交申请',user:'张工',date:'2025-06-15 09:00',state:'done',note:'新增四大模组：无线通信、电源、传感器、包装'},
     {title:'主管审批',user:'王主管',date:'2025-06-15 11:30',state:'done',note:'同意，产品功能完善需求合理'},
     {title:'品质审核',user:'赵品质',date:'—',state:'active',note:'审批中…'},
     {title:'总监审批',user:'陈总监',date:'—',state:'pending'},
     {title:'完成发布',user:'—',date:'—',state:'pending'}
   ]},
  {id:'APR-2025-004',ver:'V2.1',applicant:'张工',date:'2025-05-10',node:'完成',status:'已通过',statusClass:'badge-green',
   timeline:[
     {title:'提交申请',user:'张工',date:'2025-05-10 08:45',state:'done'},
     {title:'主管审批',user:'王主管',date:'2025-05-10 14:00',state:'done',note:'同意，PCBA增强方案经过评审'},
     {title:'品质审核',user:'赵品质',date:'2025-05-11 09:30',state:'done',note:'新增元件均通过可靠性测试'},
     {title:'总监审批',user:'陈总监',date:'2025-05-11 16:00',state:'done',note:'批准，触摸屏升级方案可行'},
     {title:'完成发布',user:'系统',date:'2025-05-11 16:00',state:'done'}
   ]},
  {id:'APR-2025-003',ver:'V2.0',applicant:'张工',date:'2025-03-08',node:'总监审批',status:'待审批',statusClass:'badge-yellow',
   timeline:[
     {title:'提交申请',user:'张工',date:'2025-03-08 09:15',state:'done'},
     {title:'主管审批',user:'王主管',date:'2025-03-08 14:30',state:'done',note:'同意，物料变更合理'},
     {title:'品质审核',user:'赵品质',date:'2025-03-09 10:00',state:'done',note:'品质验证通过'},
     {title:'总监审批',user:'陈总监',date:'—',state:'active',note:'审批中…'},
     {title:'完成发布',user:'—',date:'—',state:'pending'}
   ]},
  {id:'APR-2025-002',ver:'V1.1',applicant:'张工',date:'2025-01-14',node:'完成',status:'已通过',statusClass:'badge-green',
   timeline:[
     {title:'提交申请',user:'张工',date:'2025-01-14 08:30',state:'done'},
     {title:'主管审批',user:'王主管',date:'2025-01-14 11:00',state:'done',note:'同意'},
     {title:'品质审核',user:'赵品质',date:'2025-01-15 09:20',state:'done',note:'通过'},
     {title:'总监审批',user:'陈总监',date:'2025-01-15 16:45',state:'done',note:'批准发布'},
     {title:'完成发布',user:'系统',date:'2025-01-15 16:45',state:'done'}
   ]},
  {id:'APR-2024-001',ver:'V1.0',applicant:'李工',date:'2024-10-14',node:'完成',status:'已通过',statusClass:'badge-green',
   timeline:[
     {title:'提交申请',user:'李工',date:'2024-10-14 10:00',state:'done'},
     {title:'主管审批',user:'王主管',date:'2024-10-14 15:00',state:'done',note:'同意'},
     {title:'品质审核',user:'赵品质',date:'2024-10-15 09:00',state:'done',note:'通过'},
     {title:'总监审批',user:'陈总监',date:'2024-10-15 17:00',state:'done',note:'同意'},
     {title:'完成发布',user:'系统',date:'2024-10-15 17:00',state:'done'}
   ]},
  {id:'APR-2024-000',ver:'V0.8-beta',applicant:'李工',date:'2024-09-10',node:'品质审核',status:'已驳回',statusClass:'badge-red',
    timeline:[
      {title:'提交申请',user:'李工',date:'2024-09-10 09:00',state:'done'},
      {title:'主管审批',user:'王主管',date:'2024-09-10 14:00',state:'done',note:'同意'},
      {title:'品质审核',user:'赵品质',date:'2024-09-11 11:00',state:'rejected',note:'电阻规格不符，请修正后重新提交'},
      {title:'总监审批',user:'—',date:'—',state:'pending'},
      {title:'完成发布',user:'—',date:'—',state:'pending'}
    ]},
  {id:'APR-2024-006',ver:'V0.9',applicant:'李工',date:'2024-09-20',node:'完成',status:'已通过',statusClass:'badge-green',type:'新版本发布',urgency:'普通',
    timeline:[
      {title:'提交申请',user:'李工',date:'2024-09-20 09:00',state:'done',note:'新版本发布 — 草稿版本提交评审'},
      {title:'主管审批',user:'王主管',date:'2024-09-20 14:30',state:'done',note:'同意'},
      {title:'品质审核',user:'赵品质',date:'2024-09-21 10:00',state:'done',note:'通过'},
      {title:'总监审批',user:'陈总监',date:'2024-09-21 16:00',state:'done',note:'批准'},
      {title:'完成发布',user:'系统',date:'2024-09-21 16:00',state:'done'}
    ]},
  {id:'APR-2025-007',ver:'V3.0',applicant:'吴射频',date:'2025-06-18',node:'主管审批',status:'待审批',statusClass:'badge-yellow',type:'物料变更',urgency:'紧急',materials:'RF-20044, RF-20045',
    timeline:[
      {title:'提交申请',user:'吴射频',date:'2025-06-18 10:30',state:'done',note:'物料变更 — ESP32-C3供货紧张，申请增加备选供应商安信可'},
      {title:'主管审批',user:'王主管',date:'—',state:'active',note:'审批中…'},
      {title:'品质审核',user:'赵品质',date:'—',state:'pending'},
      {title:'总监审批',user:'陈总监',date:'—',state:'pending'},
      {title:'完成发布',user:'—',date:'—',state:'pending'}
    ]},
  {id:'APR-2025-008',ver:'V3.0',applicant:'刘采购',date:'2025-06-20',node:'品质审核',status:'待审批',statusClass:'badge-yellow',type:'供应商变更',urgency:'普通',materials:'C-20002, C-20018',
    timeline:[
      {title:'提交申请',user:'刘采购',date:'2025-06-20 08:00',state:'done',note:'供应商变更 — 三星电机贴片电容交期延长，切换风华高科'},
      {title:'主管审批',user:'王主管',date:'2025-06-20 11:00',state:'done',note:'同意，价格差异在可接受范围'},
      {title:'品质审核',user:'赵品质',date:'—',state:'active',note:'审批中…'},
      {title:'总监审批',user:'陈总监',date:'—',state:'pending'},
      {title:'完成发布',user:'—',date:'—',state:'pending'}
    ]},
  {id:'APR-2025-009',ver:'V2.1',applicant:'周结构',date:'2025-05-20',node:'主管审批',status:'已驳回',statusClass:'badge-red',type:'设计变更',urgency:'普通',materials:'CASE-20006, CASE-20007',
    timeline:[
      {title:'提交申请',user:'周结构',date:'2025-05-20 14:00',state:'done',note:'设计变更 — 机壳材料由PC+ABS改为全PC'},
      {title:'主管审批',user:'王主管',date:'2025-05-21 09:30',state:'rejected',note:'模具改造成本过高，建议保持原方案'},
      {title:'品质审核',user:'赵品质',date:'—',state:'pending'},
      {title:'总监审批',user:'陈总监',date:'—',state:'pending'},
      {title:'完成发布',user:'—',date:'—',state:'pending'}
    ]}
];
