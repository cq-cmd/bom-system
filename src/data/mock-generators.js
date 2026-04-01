export const lifecyclePhases = ['新建','试产','量产','EOL','停产'];
var lcPhaseColors = {'新建':'var(--blue)','试产':'var(--yellow)','量产':'var(--green)','EOL':'var(--orange)','停产':'var(--red)'};

export const lcPhaseColors = {'新建':'var(--blue)','试产':'var(--yellow)','量产':'var(--green)','EOL':'var(--orange)','停产':'var(--red)'};
var lcBadgeClass = {'新建':'badge-blue','试产':'badge-yellow','量产':'badge-green','EOL':'badge-yellow','停产':'badge-red'};

export const lcBadgeClass = {'新建':'badge-blue','试产':'badge-yellow','量产':'badge-green','EOL':'badge-yellow','停产':'badge-red'};


export function buildLifecycleData() {
  lifecycleData = materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i);
    hash = Math.abs(hash);
    var phase = m.status === '停用' ? '停产' : m.status === '待审' ? '新建' : lifecyclePhases[hash % 3 + 1];
    var eolDate = phase === 'EOL' ? '2025-09-' + String(10 + (hash % 20)).padStart(2,'0') : phase === '量产' && hash % 5 === 0 ? '2026-03-' + String(1 + (hash % 28)).padStart(2,'0') : '';
    return {id:m.id, name:m.name, phase:phase, supplier:m.supplier, eolDate:eolDate, lastChange:m.id.includes('20') ? '2025-06-' + String(1 + hash % 14).padStart(2,'0') : '2025-05-01'};
  });
}

export function buildInventoryData() {
  inventoryData = materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i); hash=Math.abs(hash);
    var demand = m.qty * (10 + hash % 50);
    var stock = Math.round(demand * (0.3 + (hash % 150) / 100));
    var safety = Math.round(demand * 0.3);
    var moq = Math.max(100, Math.round(demand / 10) * 10);
    var leadDays = 7 + hash % 28;
    var avgDailyUsage = Math.round(demand / 30 * 10) / 10;
    var reorderPoint = Math.round(safety + avgDailyUsage * leadDays);
    var status = stock < safety ? 'shortage' : stock > demand * 2 ? 'overstock' : stock < reorderPoint ? 'reorder' : 'ok';
    return {id:m.id, name:m.name, demand:demand, stock:stock, safety:safety, moq:moq, leadDays:leadDays, status:status, supplier:m.supplier, price:m.price, avgDailyUsage:avgDailyUsage, reorderPoint:reorderPoint};
  });
}

export function buildComplianceData() {
  complianceData = materialsFlat.map(function(m) {
    var hash=0;for(var i=0;i<m.id.length;i++)hash=((hash<<5)-hash)+m.id.charCodeAt(i);hash=Math.abs(hash);
    var rohs = hash%10<8?'合规':(hash%10===8?'待检':'不合规');
    var reach = hash%12<9?'合规':(hash%12===9?'待检':'不合规');
    var conflict = hash%8<6?'无风险':(hash%8===6?'待查':'有风险');
    var ul = m.id.startsWith('IC')||m.id.startsWith('PWR')?(hash%6<4?'已认证':'即将到期'):'N/A';
    var expiry = ul==='即将到期'?'2025-'+(7+hash%5)+'-'+(1+hash%28):'';
    return {id:m.id,name:m.name,rohs:rohs,reach:reach,conflict:conflict,ul:ul,expiry:expiry};
  });
}
