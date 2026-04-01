// PDM 扩展模块 (生命周期/成本分析/库存/工艺/产品配置/合规)
import { state, allBOMs, versions } from './state.js';
import { nowStr, todayStr } from '../utils/format.js';
import { navigateTo, showToast } from './navigation.js';
import { showMatDetail } from './materials.js';
import { computeNodeCost } from './bom-tree.js';

// ========== PDM MODULES ==========

var lifecyclePhases = ['新建','试产','量产','EOL','停产'];
var lcPhaseColors = {'新建':'var(--blue)','试产':'var(--yellow)','量产':'var(--green)','EOL':'var(--orange)','停产':'var(--red)'};
var lcBadgeClass = {'新建':'badge-blue','试产':'badge-yellow','量产':'badge-green','EOL':'badge-yellow','停产':'badge-red'};

var lifecycleData = [];
function buildLifecycleData() {
  lifecycleData = state.materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i);
    hash = Math.abs(hash);
    var phase = m.status === '停用' ? '停产' : m.status === '待审' ? '新建' : lifecyclePhases[hash % 3 + 1];
    var eolDate = phase === 'EOL' ? '2025-09-' + String(10 + (hash % 20)).padStart(2,'0') : phase === '量产' && hash % 5 === 0 ? '2026-03-' + String(1 + (hash % 28)).padStart(2,'0') : '';
    return {id:m.id, name:m.name, phase:phase, supplier:m.supplier, eolDate:eolDate, lastChange:m.id.includes('20') ? '2025-06-' + String(1 + hash % 14).padStart(2,'0') : '2025-05-01'};
  });
}

function renderLifecycle() {
  buildLifecycleData();
  var q = (document.getElementById('lcSearch')?.value || '').toLowerCase();
  var pf = document.getElementById('lcPhaseFilter')?.value || 'all';
  var data = lifecycleData;
  if (pf !== 'all') data = data.filter(function(d) { return d.phase === pf; });
  if (q) data = data.filter(function(d) { return d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q); });
  var counts = {}; lifecyclePhases.forEach(function(p) { counts[p] = 0; }); lifecycleData.forEach(function(d) { counts[d.phase]++; });
  var sc = document.getElementById('lcStatCards');
  if (sc) sc.innerHTML = lifecyclePhases.map(function(p) { return '<div class="stat-card"><div class="stat-num" style="color:'+lcPhaseColors[p]+'">'+counts[p]+'</div><div class="stat-label">'+p+'</div></div>'; }).join('');
  var flow = document.getElementById('lcFlowChart');
  if (flow) flow.innerHTML = lifecyclePhases.map(function(p, i) {
    return '<div style="display:flex;align-items:center;gap:8px">' +
      '<div style="padding:10px 20px;background:'+lcPhaseColors[p]+';color:#fff;border-radius:var(--radius);font-weight:600;font-size:13px;min-width:70px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.15)">' + p + '<div style="font-size:10px;font-weight:400;opacity:.8;margin-top:2px">'+counts[p]+' 项</div></div>' +
      (i < lifecyclePhases.length - 1 ? '<span style="font-size:18px;color:var(--text-muted)">→</span>' : '') + '</div>';
  }).join('');
  var kanban = document.getElementById('lcKanban');
  if (kanban) kanban.innerHTML = lifecyclePhases.map(function(p) {
    var items = data.filter(function(d) { return d.phase === p; }).slice(0, 8);
    return '<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:12px;min-height:200px">' +
      '<div style="font-weight:600;font-size:12px;margin-bottom:10px;display:flex;justify-content:space-between"><span class="badge '+lcBadgeClass[p]+'">'+p+'</span><span style="color:var(--text-muted)">'+items.length+'</span></div>' +
      items.map(function(d) {
        return '<div style="padding:8px;background:var(--bg-primary);border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:6px;font-size:11px;cursor:pointer" onclick="navigateTo(\'materials\');showMatDetail(\''+d.id+'\')">' +
          '<div style="font-weight:500;color:var(--accent)">'+d.id+'</div><div style="color:var(--text-secondary);margin-top:2px">'+d.name+'</div>' +
          (d.eolDate ? '<div style="color:var(--orange);margin-top:3px;font-size:10px">⚠ EOL: '+d.eolDate+'</div>' : '') + '</div>';
      }).join('') + '</div>';
  }).join('');
  var eolAlerts = document.getElementById('lcEolAlerts');
  var eolItems = lifecycleData.filter(function(d) { return d.eolDate; });
  if (eolAlerts) eolAlerts.innerHTML = eolItems.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 暂无EOL预警</div>' :
    eolItems.sort(function(a,b){return a.eolDate.localeCompare(b.eolDate);}).map(function(d) {
      var days = Math.max(0, Math.round((new Date(d.eolDate) - new Date()) / 86400000));
      var urgent = days < 90;
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid '+(urgent?'var(--red)':'var(--border)')+';border-left:3px solid '+(urgent?'var(--red)':'var(--orange)')+';border-radius:var(--radius);margin-bottom:6px;font-size:12px">' +
        '<span style="font-size:16px">'+(urgent?'🔴':'🟡')+'</span>' +
        '<div style="flex:1"><b style="color:var(--accent)">'+d.id+'</b> '+d.name+'</div>' +
        '<div style="text-align:right"><div style="font-weight:600;color:'+(urgent?'var(--red)':'var(--orange)')+'">'+d.eolDate+'</div><div style="font-size:10px;color:var(--text-muted)">剩余 '+days+' 天</div></div></div>';
    }).join('');
}

function renderCostAnalysis() {
  var totalCost = state.materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var directCost = totalCost * 0.65;
  var indirectCost = totalCost * 0.35;
  var avgUnit = state.materialsFlat.length ? totalCost / state.materialsFlat.reduce(function(s,m){return s+m.qty;},0) : 0;
  var sc = document.getElementById('costStatCards');
  if(sc) sc.innerHTML = '<div class="stat-card"><div class="stat-num" style="color:var(--accent)">¥'+totalCost.toFixed(0)+'</div><div class="stat-label">总BOM成本</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">¥'+directCost.toFixed(0)+'</div><div class="stat-label">直接材料</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">¥'+indirectCost.toFixed(0)+'</div><div class="stat-label">间接成本</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">¥'+avgUnit.toFixed(2)+'</div><div class="stat-label">平均单价</div></div>';
  var rollup = document.getElementById('costRollup');
  if(rollup && state.bomData.children) {
    rollup.innerHTML = '<table style="width:100%;font-size:12px"><thead><tr><th>组件</th><th>直接成本</th><th>子项成本</th><th>总成本</th><th>占比</th></tr></thead><tbody>' +
      state.bomData.children.map(function(child) {
        var cost = computeNodeCost(child);
        var pct = totalCost > 0 ? (cost.total / totalCost * 100).toFixed(1) : '0';
        return '<tr><td style="font-weight:500">'+child.icon+' '+child.name+'</td><td class="text-right">¥'+cost.self.toFixed(2)+'</td><td class="text-right">¥'+cost.children.toFixed(2)+'</td><td class="text-right" style="font-weight:600;color:var(--accent)">¥'+cost.total.toFixed(2)+'</td><td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:3px"></div></div><span style="min-width:36px;text-align:right;color:var(--text-muted)">'+pct+'%</span></div></td></tr>';
      }).join('') + '</tbody></table>';
  }
  var track = document.getElementById('costDownTrack');
  var targets = [{name:'V1.0→V2.0 电容国产化',saved:320,target:500},{name:'V2.0→V3.0 IC替代降本',saved:180,target:400},{name:'Q3 包材优化',saved:50,target:200},{name:'Q4 供应商议价',saved:0,target:600}];
  if(track) track.innerHTML = targets.map(function(t) {
    var pct = Math.min(100, (t.saved / t.target * 100));
    return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="font-weight:500">'+t.name+'</span><span style="color:var(--green)">¥'+t.saved+' / ¥'+t.target+'</span></div><div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,var(--green),var(--accent));border-radius:4px;transition:width .3s"></div></div></div>';
  }).join('');
  var selA = document.getElementById('costVerA');
  var selB = document.getElementById('costVerB');
  if(selA && versions) { selA.innerHTML = versions.map(function(v){return '<option value="'+v.ver+'">'+v.ver+'</option>';}).join(''); selA.value = versions[1]?.ver || versions[0].ver; }
  if(selB && versions) { selB.innerHTML = versions.map(function(v){return '<option value="'+v.ver+'">'+v.ver+'</option>';}).join(''); selB.value = versions[0].ver; }
  renderCostCompare();
  initWhatIf();
}

function renderCostCompare() {
  var el = document.getElementById('costCompare');
  if (!el) return;
  var verA = document.getElementById('costVerA')?.value || '';
  var verB = document.getElementById('costVerB')?.value || '';
  var totalA = state.materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0) * 0.85;
  var totalB = state.materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var diff = totalB - totalA;
  var pct = totalA > 0 ? ((diff / totalA) * 100).toFixed(1) : '0';
  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;text-align:center;padding:16px"><div><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">'+verA+'</div><div style="font-size:22px;font-weight:700;color:var(--text-secondary)">¥'+totalA.toFixed(0)+'</div></div><div style="font-size:24px;color:'+(diff>0?'var(--red)':'var(--green)')+'">→ '+(diff>0?'↑':'↓')+' '+(diff>0?'+':'')+pct+'%</div><div><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">'+verB+'</div><div style="font-size:22px;font-weight:700;color:var(--accent)">¥'+totalB.toFixed(0)+'</div></div></div>' +
    '<div style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:8px">成本变化: <b style="color:'+(diff>0?'var(--red)':'var(--green)');+'">'+(diff>0?'+':'')+'¥'+diff.toFixed(0)+'</b></div>';
}

// ===== What-if Cost Simulator =====
var whatIfOverrides = {};

function initWhatIf() {
  whatIfOverrides = {};
  var container = document.getElementById('whatIfSliders');
  if (!container || !state.materialsFlat || !state.materialsFlat.length) return;
  // Pick top 6 materials by total cost contribution (price * qty)
  var sorted = state.materialsFlat.slice().sort(function(a,b){return (b.price*b.qty)-(a.price*a.qty);});
  var topMats = sorted.slice(0, 6);
  container.innerHTML = topMats.map(function(m) {
    var minP = Math.round(m.price * 0.5 * 100) / 100;
    var maxP = Math.round(m.price * 2 * 100) / 100;
    var step = m.price > 10 ? 1 : 0.1;
    return '<div style="margin-bottom:10px;display:grid;grid-template-columns:120px 1fr 60px;gap:8px;align-items:center;font-size:12px">' +
      '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary)" title="'+m.id+' '+m.name+'">'+m.icon+' '+m.name+'</span>' +
      '<input type="range" min="'+minP+'" max="'+maxP+'" step="'+step+'" value="'+m.price+'" data-mid="'+m.id+'" data-orig="'+m.price+'" oninput="updateWhatIf(this)" style="width:100%;accent-color:var(--accent)">' +
      '<span id="wif-'+m.id.replace(/[^a-zA-Z0-9]/g,'_')+'" style="font-weight:600;text-align:right;color:var(--accent)">¥'+m.price.toFixed(m.price>10?0:2)+'</span>' +
      '</div>';
  }).join('');
  updateWhatIfResult();
}

function updateWhatIf(slider) {
  var mid = slider.getAttribute('data-mid');
  var orig = parseFloat(slider.getAttribute('data-orig'));
  var val = parseFloat(slider.value);
  whatIfOverrides[mid] = val;
  var label = document.getElementById('wif-'+mid.replace(/[^a-zA-Z0-9]/g,'_'));
  if (label) {
    var diff = ((val - orig) / orig * 100).toFixed(1);
    var color = val > orig ? 'var(--red)' : val < orig ? 'var(--green)' : 'var(--accent)';
    label.innerHTML = '¥'+ val.toFixed(val>10?0:2) + (val !== orig ? ' <span style="color:'+color+';font-size:10px">'+(val>orig?'+':'')+diff+'%</span>' : '');
  }
  updateWhatIfResult();
}

function updateWhatIfResult() {
  var el = document.getElementById('whatIfResult');
  if (!el || !state.materialsFlat) return;
  var origTotal = state.materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var newTotal = state.materialsFlat.reduce(function(s,m){
    var p = whatIfOverrides[m.id] !== undefined ? whatIfOverrides[m.id] : m.price;
    return s + p * m.qty;
  },0);
  var diff = newTotal - origTotal;
  var pct = origTotal > 0 ? (diff / origTotal * 100).toFixed(2) : '0';
  var color = diff > 0 ? 'var(--red)' : diff < 0 ? 'var(--green)' : 'var(--text-muted)';
  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;text-align:center">' +
    '<div><div style="font-size:10px;color:var(--text-muted)">原始成本</div><div style="font-size:18px;font-weight:700;color:var(--text-secondary)">¥'+origTotal.toFixed(0)+'</div></div>' +
    '<div style="font-size:20px;color:'+color+'">→ '+(diff>0?'↑':'↓')+' '+(diff>0?'+':'')+pct+'%</div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">模拟成本</div><div style="font-size:18px;font-weight:700;color:'+color+'">¥'+newTotal.toFixed(0)+'</div></div>' +
    '</div><div style="text-align:center;margin-top:6px;font-size:11px;color:'+color+'">差额: '+(diff>0?'+':'')+'¥'+diff.toFixed(0)+'</div>';
}

function resetWhatIf() {
  whatIfOverrides = {};
  initWhatIf();
}

var inventoryData = [];
function buildInventoryData() {
  inventoryData = state.materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i); hash=Math.abs(hash);
    var demand = m.qty * (10 + hash % 50);
    var stock = Math.round(demand * (0.3 + (hash % 150) / 100));
    var safety = Math.round(demand * 0.3);
    var moq = Math.max(100, Math.round(demand / 10) * 10);
    var leadDays = 7 + hash % 28;
    var status = stock < safety ? 'shortage' : stock > demand * 2 ? 'overstock' : stock < safety * 1.5 ? 'reorder' : 'ok';
    return {id:m.id, name:m.name, demand:demand, stock:stock, safety:safety, moq:moq, leadDays:leadDays, status:status, supplier:m.supplier, price:m.price};
  });
}

function renderInventory() {
  buildInventoryData();
  var q = (document.getElementById('invSearch')?.value||'').toLowerCase();
  var af = document.getElementById('invAlertFilter')?.value||'all';
  var data = inventoryData;
  if(af!=='all') data=data.filter(function(d){return d.status===af;});
  if(q) data=data.filter(function(d){return d.id.toLowerCase().includes(q)||d.name.toLowerCase().includes(q);});
  var sc = document.getElementById('invStatCards');
  var shortage=inventoryData.filter(function(d){return d.status==='shortage';}).length;
  var reorder=inventoryData.filter(function(d){return d.status==='reorder';}).length;
  var overstock=inventoryData.filter(function(d){return d.status==='overstock';}).length;
  var totalVal=inventoryData.reduce(function(s,d){return s+d.stock*d.price;},0);
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--red)">'+shortage+'</div><div class="stat-label">缺料预警</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+reorder+'</div><div class="stat-label">需要补货</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+overstock+'</div><div class="stat-label">库存过剩</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">¥'+Math.round(totalVal/10000)+'万</div><div class="stat-label">库存总值</div></div>';
  var statusBadge={'shortage':'<span class="badge badge-red">缺料</span>','reorder':'<span class="badge badge-yellow">补货</span>','overstock':'<span class="badge badge-blue">过剩</span>','ok':'<span class="badge badge-green">正常</span>'};
  var actionMap={'shortage':'紧急采购','reorder':'建议补货','overstock':'控制入库','ok':'—'};
  var tb=document.getElementById('invBody');
  if(tb) tb.innerHTML=data.slice(0,30).map(function(d){
    var reorderBadge = d.stock < d.safety ? '<span class="badge badge-red" style="font-size:10px">低于安全库存</span>' : d.stock < (d.reorderPoint||d.safety*1.5) ? '<span class="badge badge-yellow" style="font-size:10px">需补货</span>' : '';
    return '<tr><td style="color:var(--accent);font-weight:500">'+d.id+'</td><td>'+d.name+'</td><td class="text-right">'+d.demand+'</td><td class="text-right" style="font-weight:600;color:'+(d.stock<d.safety?'var(--red)':'var(--text-primary)')+'">'+d.stock+'</td><td class="text-right">'+d.safety+'</td><td class="text-right" style="color:var(--text-muted)">'+(d.reorderPoint||'—')+'</td><td class="text-right" style="color:var(--text-muted)">'+(d.avgDailyUsage||'—')+'</td><td class="text-right">'+d.moq+'</td><td class="text-right">'+d.leadDays+'天</td><td>'+statusBadge[d.status]+' '+reorderBadge+'</td><td style="font-size:11px;color:'+(d.status==='shortage'?'var(--red)':'var(--text-secondary)')+'">'+actionMap[d.status]+'</td></tr>';
  }).join('');
  var sa=document.getElementById('shortageAnalysis');
  var shortItems=inventoryData.filter(function(d){return d.status==='shortage';});
  var shortVal=shortItems.reduce(function(s,d){return s+(d.safety-d.stock)*d.price;},0);
  if(sa) sa.innerHTML='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px"><div class="stat-card"><div class="stat-num" style="color:var(--red)">'+shortItems.length+'</div><div class="stat-label">缺料物料数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">¥'+shortVal.toFixed(0)+'</div><div class="stat-label">预估采购金额</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+Math.round(shortItems.reduce(function(s,d){return s+d.leadDays;},0)/Math.max(shortItems.length,1))+'天</div><div class="stat-label">平均交期</div></div></div>';
}

function exportInventoryReport() {
  buildInventoryData();
  var shortage = inventoryData.filter(function(d){return d.status==='shortage'||d.status==='reorder';});
  var csv = '\uFEFF物料编号,物料名称,需求量,库存量,缺口,MOQ,建议采购量,供应商\n';
  shortage.forEach(function(d) { var gap=Math.max(0,d.safety-d.stock); var order=Math.max(d.moq,Math.ceil(gap/d.moq)*d.moq); csv+='"'+d.id+'","'+d.name+'",'+d.demand+','+d.stock+','+gap+','+d.moq+','+order+',"'+d.supplier+'"\n'; });
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});var link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='采购需求_'+todayStr()+'.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);
  showToast('采购需求已导出 ('+shortage.length+' 项)','success');
}

var processRoutes = [
  {id:'PRC-001',name:'主板PCBA加工',product:'A100 整机',steps:[{name:'钢网印刷',type:'SMT',time:5},{name:'贴片',type:'SMT',time:15},{name:'回流焊',type:'SMT',time:8},{name:'AOI检测',type:'检测',time:3},{name:'DIP插件',type:'DIP',time:10},{name:'波峰焊',type:'DIP',time:6},{name:'ICT测试',type:'测试',time:5},{name:'功能测试',type:'测试',time:8}],status:'已发布',creator:'张工'},
  {id:'PRC-002',name:'整机组装',product:'A100 整机',steps:[{name:'主板安装',type:'组装',time:3},{name:'屏幕贴合',type:'组装',time:5},{name:'排线连接',type:'组装',time:4},{name:'外壳装配',type:'组装',time:6},{name:'整机测试',type:'测试',time:10},{name:'包装',type:'包装',time:3}],status:'已发布',creator:'李工'},
  {id:'PRC-003',name:'手环PCBA加工',product:'D400 手环',steps:[{name:'钢网印刷',type:'SMT',time:4},{name:'贴片',type:'SMT',time:12},{name:'回流焊',type:'SMT',time:7},{name:'X-Ray检测',type:'检测',time:5},{name:'功能测试',type:'测试',time:6}],status:'审核中',creator:'王主管'},
  {id:'PRC-004',name:'路由器组装',product:'R900 路由器',steps:[{name:'主板安装',type:'组装',time:4},{name:'天线焊接',type:'焊接',time:8},{name:'外壳装配',type:'组装',time:5},{name:'RF测试',type:'测试',time:12},{name:'老化测试',type:'测试',time:24},{name:'包装',type:'包装',time:2}],status:'草稿',creator:'张工'}
];

function renderProcessRoutes() {
  var sc=document.getElementById('procStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+processRoutes.length+'</div><div class="stat-label">工艺路线</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">'+processRoutes.filter(function(p){return p.status==='已发布';}).length+'</div><div class="stat-label">已发布</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+processRoutes.reduce(function(s,p){return s+p.steps.length;},0)+'</div><div class="stat-label">总工序数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+processRoutes.reduce(function(s,p){return s+p.steps.reduce(function(t,st){return t+st.time;},0);},0)+'min</div><div class="stat-label">总工时</div></div>';
  var list=document.getElementById('processList');
  var typeColors={'SMT':'#5B8FA8','DIP':'#4F6D7A','组装':'#5D9B74','测试':'#C49B3C','检测':'#4D9BA5','焊接':'#C06058','包装':'#8A9198'};
  if(list) list.innerHTML=processRoutes.map(function(p) {
    var totalTime=p.steps.reduce(function(s,st){return s+st.time;},0);
    var stBadge={'已发布':'badge-green','审核中':'badge-yellow','草稿':'badge-gray'}[p.status]||'badge-gray';
    return '<div style="padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div><span style="font-weight:600;font-size:14px;color:var(--accent)">'+p.id+'</span> <span style="font-weight:600">'+p.name+'</span> <span class="badge badge-blue" style="margin-left:6px">'+p.product+'</span></div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px;color:var(--text-muted)">'+p.creator+' · '+totalTime+'min</span><span class="badge '+stBadge+'">'+p.status+'</span></div></div>' +
      '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">' + p.steps.map(function(st,i) {
        var c=typeColors[st.type]||'#94a3b8';
        return '<div style="display:flex;align-items:center;gap:4px">' +
          '<div style="padding:8px 12px;background:'+c+'15;border:1px solid '+c+'30;border-radius:var(--radius-sm);font-size:11px;text-align:center;min-width:70px"><div style="font-weight:600;color:'+c+'">'+st.name+'</div><div style="color:var(--text-muted);font-size:10px;margin-top:2px">'+st.type+' · '+st.time+'min</div></div>' +
          (i<p.steps.length-1?'<span style="color:var(--text-muted);font-size:12px">→</span>':'') + '</div>';
      }).join('') + '</div></div>';
  }).join('');
}
function showNewProcessModal() { showToast('工艺路线编辑器开发中…','info'); }

var productConfigs = [
  {id:'CFG-A100',product:'A100 整机',variants:[{name:'标准版',sku:'A100-STD',ram:'4GB',storage:'64GB',color:'黑色',price:299},{name:'高配版',sku:'A100-PRO',ram:'8GB',storage:'128GB',color:'黑色',price:399},{name:'尊享版',sku:'A100-MAX',ram:'8GB',storage:'256GB',color:'白色',price:499}]},
  {id:'CFG-P12A',product:'P12A 手机',variants:[{name:'标准版',sku:'P12A-128',ram:'8GB',storage:'128GB',color:'星空黑',price:3999},{name:'Pro版',sku:'P12A-256',ram:'12GB',storage:'256GB',color:'远峰蓝',price:4999},{name:'Ultra版',sku:'P12A-512',ram:'16GB',storage:'512GB',color:'暗夜紫',price:6999}]},
  {id:'CFG-D400',product:'D400 手环',variants:[{name:'运动版',sku:'D400-SPT',sensor:'心率+血氧',strap:'硅胶',color:'黑色',price:199},{name:'时尚版',sku:'D400-FSH',sensor:'心率+血氧+体温',strap:'不锈钢',color:'银色',price:299}]}
];
var optionalParts = [
  {group:'充电器',required:false,options:[{name:'5W充电器',id:'CHG-5W',price:15},{name:'18W快充',id:'CHG-18W',price:35},{name:'无(不含充电器)',id:'CHG-NONE',price:0}]},
  {group:'耳机',required:false,options:[{name:'有线耳机',id:'EAR-WIRE',price:12},{name:'TWS无线耳机',id:'EAR-TWS',price:89},{name:'无',id:'EAR-NONE',price:0}]},
  {group:'保护壳',required:false,options:[{name:'硅胶壳',id:'CASE-SIL',price:8},{name:'钢化膜+壳套装',id:'CASE-SET',price:25},{name:'无',id:'CASE-NONE',price:0}]},
  {group:'存储扩展',required:false,options:[{name:'无',id:'SD-NONE',price:0},{name:'64GB TF卡',id:'SD-64',price:39},{name:'128GB TF卡',id:'SD-128',price:69}]}
];

function renderProductConfig() {
  var totalVariants=productConfigs.reduce(function(s,c){return s+c.variants.length;},0);
  var sc=document.getElementById('cfgStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+productConfigs.length+'</div><div class="stat-label">产品系列</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+totalVariants+'</div><div class="stat-label">总变型数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">'+optionalParts.length+'</div><div class="stat-label">可选配置组</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+optionalParts.reduce(function(s,g){return s+g.options.length;},0)+'</div><div class="stat-label">可选项总数</div></div>';
  var vm=document.getElementById('variantMatrix');
  if(vm) vm.innerHTML=productConfigs.map(function(cfg) {
    var cols=Object.keys(cfg.variants[0]).filter(function(k){return k!=='name'&&k!=='sku';});
    return '<div style="margin-bottom:16px"><div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--accent)">'+cfg.product+'</div>' +
      '<table style="width:100%;font-size:11px"><thead><tr><th>变型</th><th>SKU</th>'+cols.map(function(c){return '<th>'+c+'</th>';}).join('')+'</tr></thead><tbody>'+
      cfg.variants.map(function(v){return '<tr><td style="font-weight:500">'+v.name+'</td><td style="color:var(--accent)">'+v.sku+'</td>'+cols.map(function(c){var val=v[c];return '<td>'+(c==='price'?'¥'+val:val)+'</td>';}).join('')+'</tr>';}).join('')+
      '</tbody></table></div>';
  }).join('');
  var op=document.getElementById('optionalParts');
  if(op) op.innerHTML=optionalParts.map(function(g) {
    return '<div style="margin-bottom:14px"><div style="font-weight:600;font-size:12px;margin-bottom:6px">'+g.group+(g.required?' <span class="badge badge-red" style="font-size:9px">必选</span>':' <span class="badge badge-gray" style="font-size:9px">可选</span>')+'</div>' +
      g.options.map(function(o){return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:4px;font-size:11px"><span style="color:var(--accent);width:70px">'+o.id+'</span><span style="flex:1">'+o.name+'</span><span style="font-weight:500;color:var(--text-secondary)">'+(o.price>0?'+¥'+o.price:'—')+'</span></div>';}).join('') +
      '</div>';
  }).join('');
}

var complianceData = [];
function buildComplianceData() {
  complianceData = state.materialsFlat.map(function(m) {
    var hash=0;for(var i=0;i<m.id.length;i++)hash=((hash<<5)-hash)+m.id.charCodeAt(i);hash=Math.abs(hash);
    var rohs = hash%10<8?'合规':(hash%10===8?'待检':'不合规');
    var reach = hash%12<9?'合规':(hash%12===9?'待检':'不合规');
    var conflict = hash%8<6?'无风险':(hash%8===6?'待查':'有风险');
    var ul = m.id.startsWith('IC')||m.id.startsWith('PWR')?(hash%6<4?'已认证':'即将到期'):'N/A';
    var expiry = ul==='即将到期'?'2025-'+(7+hash%5)+'-'+(1+hash%28):'';
    return {id:m.id,name:m.name,rohs:rohs,reach:reach,conflict:conflict,ul:ul,expiry:expiry};
  });
}

function renderCompliance() {
  buildComplianceData();
  var tf=document.getElementById('compTypeFilter')?.value||'all';
  var sf=document.getElementById('compStatusFilter')?.value||'all';
  var data=complianceData;
  if(sf!=='all') data=data.filter(function(d){return d.rohs===sf||d.reach===sf||d.ul===sf||(sf==='不合规'&&d.conflict==='有风险');});
  var rohsOk=complianceData.filter(function(d){return d.rohs==='合规';}).length;
  var rohsFail=complianceData.filter(function(d){return d.rohs==='不合规';}).length;
  var ulExpiry=complianceData.filter(function(d){return d.ul==='即将到期';}).length;
  var conflictRisk=complianceData.filter(function(d){return d.conflict==='有风险';}).length;
  var sc=document.getElementById('compStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--green)">'+rohsOk+'</div><div class="stat-label">RoHS合规</div></div><div class="stat-card"><div class="stat-num" style="color:var(--red)">'+rohsFail+'</div><div class="stat-label">RoHS不合规</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+ulExpiry+'</div><div class="stat-label">认证即将到期</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+conflictRisk+'</div><div class="stat-label">冲突矿物风险</div></div>';
  var compBadge=function(v){return v==='合规'||v==='无风险'||v==='已认证'?'<span class="badge badge-green">'+v+'</span>':v==='待检'||v==='待查'||v==='即将到期'?'<span class="badge badge-yellow">'+v+'</span>':v==='不合规'||v==='有风险'?'<span class="badge badge-red">'+v+'</span>':'<span class="badge badge-gray">'+v+'</span>';};
  var tb=document.getElementById('compBody');
  if(tb) tb.innerHTML=data.slice(0,40).map(function(d){
    var overallStatus=d.rohs==='不合规'||d.conflict==='有风险'?'不合规':d.rohs==='待检'||d.reach==='待检'||d.ul==='即将到期'?'待检':'合规';
    return '<tr><td style="color:var(--accent);font-weight:500">'+d.id+'</td><td>'+d.name+'</td><td>'+compBadge(d.rohs)+'</td><td>'+compBadge(d.reach)+'</td><td>'+compBadge(d.conflict)+'</td><td>'+compBadge(d.ul)+'</td><td style="font-size:11px;color:var(--text-muted)">'+(d.expiry||'—')+'</td><td>'+compBadge(overallStatus)+'</td></tr>';
  }).join('');
  var alerts=document.getElementById('compAlerts');
  var alertItems=complianceData.filter(function(d){return d.ul==='即将到期'||d.rohs==='不合规'||d.conflict==='有风险';});
  if(alerts) alerts.innerHTML=alertItems.length===0?'<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 所有物料合规</div>':
    alertItems.slice(0,10).map(function(d){
      var reason=d.rohs==='不合规'?'RoHS不合规':d.conflict==='有风险'?'冲突矿物风险':'UL认证即将到期';
      var color=d.rohs==='不合规'?'var(--red)':d.conflict==='有风险'?'var(--orange)':'var(--yellow)';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-left:3px solid '+color+';border-radius:var(--radius);margin-bottom:6px;font-size:12px"><b style="color:var(--accent);min-width:80px">'+d.id+'</b><span style="flex:1">'+d.name+'</span><span style="color:'+color+';font-weight:500">'+reason+'</span>'+(d.expiry?'<span style="color:var(--text-muted);font-size:10px">到期: '+d.expiry+'</span>':'')+'</div>';
    }).join('');
}

function exportComplianceReport() {
  buildComplianceData();
  var csv='\uFEFF物料编号,物料名称,RoHS,REACH,冲突矿物,UL认证,认证到期\n';
  complianceData.forEach(function(d){csv+='"'+d.id+'","'+d.name+'","'+d.rohs+'","'+d.reach+'","'+d.conflict+'","'+d.ul+'","'+(d.expiry||'')+'"\n';});
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});var link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='合规报告_'+todayStr()+'.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);
  showToast('合规报告已导出','success');
}


export { buildLifecycleData, renderLifecycle, renderCostAnalysis, renderCostCompare, buildInventoryData, renderInventory, exportInventoryReport, renderProcessRoutes, showNewProcessModal, renderProductConfig, buildComplianceData, renderCompliance, exportComplianceReport, updateWhatIf, resetWhatIf };
