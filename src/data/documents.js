  if(typeof documentsData!=='undefined')documentsData.filter(function(d){return d.status==='已发布'}).slice(0,2).forEach(function(d){activities.push({text:d.uploader+' 发布了文档 '+d.name,time:d.date+' 11:00',color:'var(--green)',nav:'documents',act:"showDocDetail('"+d.id+"')"})});
  activities.sort(function(a,b){return b.time.localeCompare(a.time)});
