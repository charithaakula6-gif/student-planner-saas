/* Student Planner SaaS — beginner-friendly vanilla JavaScript */
const STORAGE_KEY = "studyspace-planner-v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function makeId() { return `${Date.now()}-${Math.random().toString(16).slice(2,8)}`; }

const demoData = {
  tasks: [
    {id:"t1", title:"Finish mathematics practice", priority:"High", done:false},
    {id:"t2", title:"Read chapter 3 of physics", priority:"Medium", done:true},
    {id:"t3", title:"Revise JavaScript basics", priority:"Low", done:false}
  ],
  timetable: [
    {id:"s1", subject:"Mathematics", time:"08:00–09:00"},
    {id:"s2", subject:"Physics", time:"10:00–11:00"},
    {id:"s3", subject:"Computer Science", time:"14:00–15:00"},
    {id:"s4", subject:"Revision", time:"16:00–16:30"}
  ],
  assignments: [
    {id:"a1", title:"Web development mini project", due:dateOffset(2), priority:"High", done:false},
    {id:"a2", title:"Mathematics homework", due:dateOffset(4), priority:"Medium", done:false}
  ],
  exams: [
    {id:"e1", subject:"Physics", date:dateOffset(7)},
    {id:"e2", subject:"Mathematics", date:dateOffset(14)}
  ],
  goals: [
    {id:"g1", title:"Study for at least one hour", done:false},
    {id:"g2", title:"Complete all assignments", done:false},
    {id:"g3", title:"Revise yesterday's notes", done:true}
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...structuredClone(demoData), ...parsed };
    }
  } catch (error) {
    console.warn("Saved planner data could not be loaded.", error);
  }
  return structuredClone(demoData);
}
let data = loadData();
let showAllTasks = false;
let toastTimer;

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (error) { showToast("Could not save data in this browser."); }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}
function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, {day:"numeric", month:"short", year:"numeric"});
}
function dayDifference(dateString) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.round((target - today) / 86400000);
}
function priorityClass(priority) { return String(priority).toLowerCase(); }
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function emptyMessage(container, message) {
  container.innerHTML = `<p class="empty-state">${escapeHTML(message)}</p>`;
}
function renderTasks() {
  const list = $("#taskList");
  const tasks = showAllTasks ? data.tasks : data.tasks.slice(0,5);
  if (!tasks.length) { list.innerHTML = ""; $("#taskEmpty").hidden = false; }
  else {
    $("#taskEmpty").hidden = true;
    list.innerHTML = tasks.map(task => `
      <div class="task-row ${task.done ? "done" : ""}">
        <input class="task-check" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} complete" data-task-check="${task.id}" ${task.done ? "checked" : ""}>
        <span class="task-name">${escapeHTML(task.title)}</span>
        <span class="priority ${priorityClass(task.priority)}">${escapeHTML(task.priority)}</span>
        <span class="row-actions">
          <button class="icon-btn" data-task-edit="${task.id}" aria-label="Edit task">✎</button>
          <button class="icon-btn" data-task-delete="${task.id}" aria-label="Delete task">×</button>
        </span>
      </div>`).join("");
  }
  $("#showAllTasks").textContent = showAllTasks ? "Show less ↑" : "View all →";
}
function renderTimetable() {
  const list = $("#studyList");
  if (!data.timetable.length) return emptyMessage(list, "No study slots yet. Add one to plan your day.");
  list.innerHTML = data.timetable.map((slot,index) => `
    <div class="schedule-row">
      <span class="schedule-time">${escapeHTML(slot.time)}</span>
      <span class="schedule-subject"><span class="schedule-dot" style="background:${["#4b78f5","#21b995","#f06d8c","#8c6af4"][index%4]}"></span>${escapeHTML(slot.subject)}</span>
      <button class="schedule-delete" data-study-delete="${slot.id}" aria-label="Delete study slot">×</button>
    </div>`).join("");
}
function renderAssignments() {
  const list = $("#assignmentList");
  if (!data.assignments.length) return emptyMessage(list, "No assignments added yet.");
  list.innerHTML = data.assignments.map(item => {
    const days = dayDifference(item.due);
    const dueText = days < 0 ? `${Math.abs(days)} day(s) overdue` : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due ${formatDate(item.due)}`;
    return `<div class="item-row">
      <span class="item-icon">📝</span><div class="item-main"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(dueText)}</small></div>
      <div class="item-side"><span class="priority ${priorityClass(item.priority)}">${escapeHTML(item.priority)}</span>
      <input type="checkbox" class="task-check" aria-label="Mark assignment complete" data-assignment-check="${item.id}" ${item.done?"checked":""}>
      <button class="item-delete" data-assignment-delete="${item.id}" aria-label="Delete assignment">×</button></div>
    </div>`;
  }).join("");
}
function renderExams() {
  const list = $("#examList");
  if (!data.exams.length) return emptyMessage(list, "No exams added yet. Add a date to stay prepared.");
  const exams = [...data.exams].sort((a,b) => a.date.localeCompare(b.date));
  list.innerHTML = exams.map(item => {
    const days = dayDifference(item.date);
    const text = days < 0 ? "Date has passed" : days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `${days} days left`;
    return `<div class="item-row"><span class="item-icon">📚</span><div class="item-main"><strong>${escapeHTML(item.subject)}</strong><small>${escapeHTML(formatDate(item.date))}</small></div><div class="item-side"><span class="status-pill ${days < 0 ? "overdue":""}">${escapeHTML(text)}</span><button class="item-delete" data-exam-delete="${item.id}" aria-label="Delete exam">×</button></div></div>`;
  }).join("");
}
function renderGoals() {
  const list = $("#goalList");
  if (!data.goals.length) return emptyMessage(list, "Add a goal to give your study session direction.");
  list.innerHTML = data.goals.map(goal => `
    <div class="goal-row ${goal.done?"done":""}">
      <input type="checkbox" aria-label="Complete goal" data-goal-check="${goal.id}" ${goal.done?"checked":""}>
      <span class="goal-title">${escapeHTML(goal.title)}</span>
      <button class="goal-delete" data-goal-delete="${goal.id}" aria-label="Delete goal">×</button>
    </div>`).join("");
}
function renderStats() {
  const total = data.tasks.length, done = data.tasks.filter(t=>t.done).length;
  const percent = total ? Math.round(done/total*100) : 0;
  $("#statTasks").textContent = total;
  $("#statTaskNote").textContent = `${done} completed`;
  $("#statAssignments").textContent = data.assignments.length;
  $("#statExams").textContent = data.exams.filter(e=>dayDifference(e.date)>=0).length;
  $("#statCompleted").textContent = `${percent}%`;
  $("#taskBar").style.width = `${total ? done/total*100 : 0}%`;
  $("#assignmentBar").style.width = `${data.assignments.length ? data.assignments.filter(a=>a.done).length/data.assignments.length*100 : 0}%`;
  $("#examBar").style.width = `${Math.min(100,data.exams.filter(e=>dayDifference(e.date)>=0).length*20)}%`;
  $("#completedBar").style.width = `${percent}%`;
  $("#progressPercent").textContent = `${percent}%`;
  $("#progressRing").style.setProperty("--progress", `${percent*3.6}deg`);
  $("#legendDone").textContent = done;
  $("#legendRemaining").textContent = total-done;
}
function renderAll() { renderTasks(); renderTimetable(); renderAssignments(); renderExams(); renderGoals(); renderStats(); }

$("#taskForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = $("#taskInput").value.trim();
  if (!title) return;
  data.tasks.unshift({id:makeId(),title,priority:$("#taskPriority").value,done:false});
  $("#taskInput").value = ""; saveData(); renderAll(); showToast("Task added to your planner!");
});
$("#taskList").addEventListener("change", event => {
  const id = event.target.dataset.taskCheck;
  if (!id) return;
  const task = data.tasks.find(t=>t.id===id);
  if (task) { task.done = event.target.checked; saveData(); renderAll(); }
});
$("#taskList").addEventListener("click", event => {
  const editId = event.target.closest("[data-task-edit]")?.dataset.taskEdit;
  const deleteId = event.target.closest("[data-task-delete]")?.dataset.taskDelete;
  if (deleteId) {
    data.tasks = data.tasks.filter(t=>t.id!==deleteId); saveData(); renderAll(); showToast("Task deleted.");
  }
  if (editId) {
    const task = data.tasks.find(t=>t.id===editId); if (!task) return;
    $("#editTaskId").value = task.id; $("#editTaskTitle").value = task.title; $("#editTaskPriority").value = task.priority;
    $("#editDialog").showModal();
  }
});
$("#editForm").addEventListener("submit", event => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const task = data.tasks.find(t=>t.id===$("#editTaskId").value);
  if (task) { task.title=$("#editTaskTitle").value.trim(); task.priority=$("#editTaskPriority").value; saveData(); renderAll(); showToast("Task updated."); }
  $("#editDialog").close();
});
$("#showAllTasks").addEventListener("click",()=>{showAllTasks=!showAllTasks;renderTasks();});
$("#quickAdd").addEventListener("click",()=>{$("#taskInput").focus();$("#tasksPanel").scrollIntoView({behavior:"smooth",block:"center"});});
$("#addStudyBtn").addEventListener("click",()=>$("#studyForm").hidden=!$("#studyForm").hidden);
$("#studyForm").addEventListener("submit",event=>{
  event.preventDefault(); const subject=$("#studySubject").value.trim(),time=$("#studyTime").value.trim();
  if(!subject||!time)return; data.timetable.push({id:makeId(),subject,time}); $("#studyForm").reset();$("#studyForm").hidden=true;saveData();renderAll();showToast("Study slot added.");
});
$("#studyList").addEventListener("click",event=>{
  const id=event.target.closest("[data-study-delete]")?.dataset.studyDelete;
  if(id){data.timetable=data.timetable.filter(s=>s.id!==id);saveData();renderAll();showToast("Study slot removed.");}
});
function toggleForm(buttonId,formId){$(buttonId).addEventListener("click",()=>{$(formId).hidden=!$(formId).hidden; if(!$(formId).hidden) $(formId).querySelector("input")?.focus();});}
toggleForm("#addAssignmentBtn","#assignmentForm");
$("#assignmentForm").addEventListener("submit",event=>{
  event.preventDefault(); const title=$("#assignmentTitle").value.trim(),due=$("#assignmentDue").value;
  if(!title||!due)return; data.assignments.push({id:makeId(),title,due,priority:$("#assignmentPriority").value,done:false});
  $("#assignmentForm").reset();$("#assignmentForm").hidden=true;saveData();renderAll();showToast("Assignment added.");
});
$("#assignmentList").addEventListener("change",event=>{
  const id=event.target.dataset.assignmentCheck;if(!id)return;
  const item=data.assignments.find(a=>a.id===id);if(item){item.done=event.target.checked;saveData();renderAll();}
});
$("#assignmentList").addEventListener("click",event=>{
  const id=event.target.closest("[data-assignment-delete]")?.dataset.assignmentDelete;
  if(id){data.assignments=data.assignments.filter(a=>a.id!==id);saveData();renderAll();showToast("Assignment deleted.");}
});
toggleForm("#addExamBtn","#examForm");
$("#examForm").addEventListener("submit",event=>{
  event.preventDefault();const subject=$("#examSubject").value.trim(),date=$("#examDate").value;
  if(!subject||!date)return;data.exams.push({id:makeId(),subject,date});$("#examForm").reset();$("#examForm").hidden=true;saveData();renderAll();showToast("Exam reminder added.");
});
$("#examList").addEventListener("click",event=>{
  const id=event.target.closest("[data-exam-delete]")?.dataset.examDelete;
  if(id){data.exams=data.exams.filter(e=>e.id!==id);saveData();renderAll();showToast("Exam removed.");}
});
toggleForm("#addGoalBtn","#goalForm");
$("#goalForm").addEventListener("submit",event=>{
  event.preventDefault();const title=$("#goalTitle").value.trim();if(!title)return;
  data.goals.push({id:makeId(),title,done:false});$("#goalForm").reset();$("#goalForm").hidden=true;saveData();renderAll();showToast("Goal added. You can do it!");
});
$("#goalList").addEventListener("change",event=>{
  const id=event.target.dataset.goalCheck;if(!id)return;
  const goal=data.goals.find(g=>g.id===id);if(goal){goal.done=event.target.checked;saveData();renderAll();}
});
$("#goalList").addEventListener("click",event=>{
  const id=event.target.closest("[data-goal-delete]")?.dataset.goalDelete;
  if(id){data.goals=data.goals.filter(g=>g.id!==id);saveData();renderAll();showToast("Goal removed.");}
});
$("#resetDemo").addEventListener("click",()=>{
  if(confirm("Reset your planner to the original demo data? Your current planner data will be replaced.")){
    data=structuredClone(demoData);saveData();renderAll();showToast("Demo data restored.");
  }
});
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$$(".nav-link").forEach(link=>link.addEventListener("click",()=>{
  $$(".nav-link").forEach(item=>item.classList.remove("active"));link.classList.add("active");
  $("#sidebar").classList.remove("open");
  const view=link.dataset.view;
  const target = view==="dashboard" ? $(".topbar") : view==="tasks" ? $("#tasksPanel") : view==="timetable" ? $("#timetablePanel") : view==="assignments" ? $("#assignmentsPanel") : view==="exams" ? $("#examsPanel") : $("#goalsPanel");
  target?.scrollIntoView({behavior:"smooth",block:"start"});
}));
$("#todayDate").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
$("#todayLabel").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
renderAll();
