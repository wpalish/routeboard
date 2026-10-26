const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const stages=[['saved','Сохранено'],['applied','Отклик отмечен'],['interview','Собеседование'],['offer','Предложение'],['rejected','Отказ'],['closed','Закрыто']];
let selectedJob,stageFilter='all';
const action=(label,fn,cls='secondary')=>{const b=node('button',label,cls);b.type='button';b.onclick=fn;return b;};
const stageName=value=>stages.find(([key])=>key===value)?.[1] || value;
const today=()=>{const now=new Date();return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');};
function dueLabel(task){if(task.status==='done')return 'Выполнено';if(task.due<today())return 'Срок прошёл';if(task.due===today())return 'Сегодня';return 'Запланировано';}
function sourceLink(value){try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol))throw Error();const a=node('a','Открыть источник вакансии ↗','source-link');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';return a;}catch{return node('p',value,'muted');}}
function taskEntry(task,job,onOpen,includeContext=true){
  const entry=node('article',undefined,'action-entry');
  const date=node('div',undefined,'action-date');date.append(node('span',task.due),node('strong',dueLabel(task)));
  const content=node('div');content.append(node('h3',task.action));if(includeContext)content.append(node('p',job?job.company+' / '+job.title:'Связь не найдена','muted'));
  if(task.archived) content.append(node('p','Архив','muted'));
  entry.append(date,content,action(task.status==='done'?'История действия':'Открыть действие',()=>onOpen('tasks',task)));
  return entry;
}
export function productView(host,{active,values,state,onOpen,onCreate,onVisibleCount}){
  if(active==='tasks'){
    const agenda=node('div',undefined,'action-agenda');
    for(const [status,label] of [['open','Следующие действия'],['done','Завершённая история']]){
      const tasks=values.filter(t=>t.status===status).sort((a,b)=>a.due.localeCompare(b.due));
      if(!tasks.length)continue;
      const section=node('section');section.append(node('h2',label+' · '+tasks.length));
      for(const task of tasks)section.append(taskEntry(task,state.data.jobs.find(j=>j.id===task.job),onOpen));
      agenda.append(section);
    }
    host.append(agenda);return true;
  }
  if(active!=='jobs')return false;
  const workspace=node('div',undefined,'route-workspace'),rail=node('section',undefined,'vacancy-rail'),journal=node('section',undefined,'vacancy-journal');
  journal.tabIndex=-1;journal.setAttribute('aria-label','Журнал выбранной вакансии');
  const filter=node('div',undefined,'stage-filter');filter.setAttribute('aria-label','Фильтр по этапу, отмеченному вручную');
  const list=node('div',undefined,'vacancy-list');
  const filters=[],choices=[];
  const tasksFor=id=>state.data.tasks.filter(t=>t.job===id&&!t.archived);
  function selectJob(job,moveFocus=false){
    selectedJob=job.id;
    for(const {id,button} of choices)button.setAttribute('aria-pressed',String(id===job.id));
    journal.replaceChildren(action('К списку вакансий',()=>{rail.scrollIntoView({block:'start',behavior:'instant'});choices.find(item=>item.id===job.id)?.button.focus({preventScroll:true});},'secondary mobile-back'),node('p','ЖУРНАЛ ВАКАНСИИ','eyebrow'),node('p',job.company,'company-name'),node('h2',job.title),node('span',stageName(job.stage)+(job.archived?' · Архив':''),'stage-badge'),sourceLink(job.url));
    const controls=node('div',undefined,'actions');controls.append(action('Изменить вакансию',()=>onOpen('jobs',job)));
    if(!job.archived)controls.append(action('Назначить действие',()=>onCreate('tasks',{job:job.id}),'primary'));
    journal.append(controls,node('p','Этап указан вручную. Запись в журнале не подтверждает отправку отклика или решение компании.','journal-note'));
    const tasks=tasksFor(job.id).sort((a,b)=>a.due.localeCompare(b.due)),open=tasks.filter(t=>t.status==='open'),done=tasks.filter(t=>t.status==='done');
    journal.append(node('h3','Следующие действия · '+open.length,'journal-section'));
    if(!open.length)journal.append(node('p','Открытых действий нет. Добавьте конкретный следующий шаг и срок.','empty-inline'));
    for(const task of open)journal.append(taskEntry(task,undefined,onOpen,false));
    if(done.length){const history=node('details');history.append(node('summary','Завершённая история · '+done.length));for(const task of done)history.append(taskEntry(task,undefined,onOpen,false));journal.append(history);}
    if(open.length)journal.append(node('p','Архив вакансии доступен после завершения открытых действий.','muted'));
    if(moveFocus&&matchMedia('(max-width:700px)').matches){journal.scrollIntoView({block:'start',behavior:'instant'});journal.focus({preventScroll:true});}
  }
  function drawList(){
    list.replaceChildren();choices.length=0;
    const filtered=values.filter(j=>stageFilter==='all'||j.stage===stageFilter);
    onVisibleCount?.(filtered.length,stageFilter==='all'?undefined:values.length);
    for(const {button,key} of filters)button.setAttribute('aria-pressed',String(key===stageFilter));
    if(!filtered.length){list.append(node('h3','В этом этапе записей нет'),node('p','Выберите другой этап или вернитесь ко всем вакансиям.','muted'),action('Все вакансии',()=>{stageFilter='all';drawList();}));journal.replaceChildren(node('p','Выберите вакансию в журнале.','empty-inline'));return;}
    for(const job of filtered){const tasks=tasksFor(job.id).filter(t=>t.status==='open').sort((a,b)=>a.due.localeCompare(b.due));const button=action('',()=>selectJob(job,true),'vacancy-item');button.append(node('span',job.company,'vacancy-company'),node('strong',job.title),node('span',stageName(job.stage)+(job.archived?' · Архив':''),'vacancy-stage'),node('span',tasks.length?tasks[0].due+' · '+tasks[0].action:'Следующий шаг не назначен','vacancy-next'));list.append(button);choices.push({button,id:job.id});}
    selectJob(filtered.find(j=>j.id===selectedJob)||filtered[0]);
  }
  for(const [key,label] of [['all','Все этапы'],...stages]){const count=key==='all'?values.length:values.filter(j=>j.stage===key).length;const button=action(label+' · '+count,()=>{stageFilter=key;drawList();},'stage-tab');filter.append(button);filters.push({button,key});}
  rail.append(filter,list);workspace.append(rail,journal);host.append(workspace);drawList();return true;
}
