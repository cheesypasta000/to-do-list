<<<<<<< Updated upstream
=======
// APP DATA
let tasks = [];
let editingId  = null;
let deletingId = null;
let filter = 'all';

// SAVE AND LOAD FROM LOCALSTORAGE
function save() {
  localStorage.setItem('mytasks', JSON.stringify(tasks));
}

function load() {
  const stored = localStorage.getItem('mytasks');
  if (stored) tasks = JSON.parse(stored);
}

// SMALL POPUP MESSAGE AT BOTTOM
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

// SHOW TODAY'S DATE IN HEADER
function showDate() {
  const d = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  document.getElementById('the-date').textContent = d.toLocaleDateString('en-US', options);
}

// FORMAT DUE DATE INTO READABLE TEXT AND COLOR
function getDueLabel(dateStr) {
  if (!dateStr) return null;

  const due   = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((due - today) / 86400000);

  if (diff < 0)   return { text: 'overdue',      color: 'var(--red)'    };
  if (diff === 0) return { text: 'due today',     color: 'var(--yellow)' };
  if (diff === 1) return { text: 'due tomorrow',  color: 'var(--yellow)' };

  return {
    text: 'due ' + due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    color: 'var(--muted)'
  };
}

// PREVENT USER INPUT FROM BREAKING THE HTML
function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// UPDATE THE 4 NUMBER BOXES AT THE TOP
function updateCounters() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const noted = tasks.filter(t => t.note && t.note.trim()).length;

  document.getElementById('c-total').textContent = total;
  document.getElementById('c-left').textContent  = total - done;
  document.getElementById('c-done').textContent  = done;
  document.getElementById('c-noted').textContent = noted;
}

// FILTER TASKS BASED ON ACTIVE TAB
function getVisible() {
  if (filter === 'active') return tasks.filter(t => !t.done);
  if (filter === 'done')   return tasks.filter(t =>  t.done);
  if (filter === 'noted')  return tasks.filter(t => t.note && t.note.trim());
  return tasks;
}

// DRAW ALL TASKS ON SCREEN (FUNCTIONALITY)
function render() {
  showDate();
  updateCounters(); 

  const list = getVisible();
  const container = document.getElementById('task-list');

  if (list.length === 0) {
    container.innerHTML = '<div class="empty">nothing here yet</div>';
    return;
  }

  container.innerHTML = list.map((t, i) => {
    const hasNote = t.note && t.note.trim();
    const due     = getDueLabel(t.due);

    return `
      <div class="task-card ${t.done ? 'done' : ''} ${t.priority}" data-id="${t.id}" style="animation-delay:${i * 0.03}s">

        <div class="task-row">
          <button class="cb check-btn" data-id="${t.id}">
            <span class="cb-tick">✓</span>
          </button>

          <div class="task-info">
            <div class="task-title">${esc(t.title)}</div>
            <div class="task-meta">
              <span class="badge ${t.priority}">${t.priority}</span>
              ${due ? `<span class="due-label" style="color:${due.color};font-size:12px">${due.text}</span>` : ''}
              ${hasNote ? `<button class="note-pill" data-id="${t.id}">note </button>` : ''} 
            </div>
          </div>

          <div class="actions">
            <button class="act edit-btn" data-id="${t.id}" title="edit">✎</button>
            <button class="act del del-btn" data-id="${t.id}" title="delete">✕</button>
          </div>
        </div>

        <div class="note-section" id="ns-${t.id}">
          <div class="note-header">
            <span class="note-label">note</span>
            <button class="note-edit-link" data-id="${t.id}">edit</button>
          </div>
          ${hasNote
            ? `<p class="note-body-text">${esc(t.note)}</p>`
            : `<p class="note-empty-text">no note yet</p>`
          }
        </div>

      </div>
    `;
  }).join('');
}

// SHOW OR HIDE THE NOTE UNDER A TASK
function toggleNote(id) {
  const el = document.getElementById('ns-' + id);
  if (el) el.classList.toggle('open');
}

// OPEN THE FORM MODAL
function openModal(id) {
  editingId = id || null;

  if (id) {
    const t = tasks.find(x => x.id === id);
    document.getElementById('f-title').value    = t.title;
    document.getElementById('f-note').value     = t.note || '';
    document.getElementById('f-priority').value = t.priority;
    document.getElementById('f-due').value      = t.due || '';
    document.getElementById('char-used').textContent = (t.note || '').length;
    document.getElementById('modal-title').textContent = 'edit task';
    document.getElementById('modal-save').textContent  = 'update';
  } else {
    document.getElementById('f-title').value    = '';
    document.getElementById('f-note').value     = '';
    document.getElementById('f-priority').value = 'normal';
    document.getElementById('f-due').value      = '';
    document.getElementById('char-used').textContent = '0';
    document.getElementById('modal-title').textContent = 'new task';
    document.getElementById('modal-save').textContent  = 'save';
  }

  document.getElementById('task-modal').classList.add('open');
  setTimeout(() => document.getElementById('f-title').focus(), 60);
}

function closeModal() {
  document.getElementById('task-modal').classList.remove('open');
  editingId = null;
}

// SAVE NEW TASK OR UPDATE EXISTING ONE
function saveTask() {
  const title    = document.getElementById('f-title').value.trim();
  const note     = document.getElementById('f-note').value.trim();
  const priority = document.getElementById('f-priority').value;
  const due      = document.getElementById('f-due').value;

  // title is required
  if (!title) {
    const input = document.getElementById('f-title');
    input.style.borderColor = 'var(--red)';
    input.focus();
    setTimeout(() => input.style.borderColor = '', 1000);
    return;
  }

  if (editingId) {
    // UPDATE EXISTING TASK
    const t   = tasks.find(x => x.id === editingId);
    t.title    = title;
    t.note     = note;
    t.priority = priority;
    t.due      = due;
    toast('updated!');
  } else {
    // CREATE NEW TASK
    tasks.unshift({
      id:       Date.now(),
      title,
      note,
      priority,
      due,
      done:     false,
      created:  Date.now()
    });
    toast('task added!');
  }

  save();
  render();
  closeModal();
}

// MARK TASK AS DONE OR ACTIVE
function toggleDone(id) {
  const t = tasks.find(x => x.id === id);
  t.done = !t.done;
  save();
  render();
  toast(t.done ? 'done ✓' : 'marked active');
}

// OPEN DELETE CONFIRMATION
function openDelete(id) {
  deletingId = id;
  const t = tasks.find(x => x.id === id);
  document.getElementById('del-name').textContent = '"' + t.title + '"';
  document.getElementById('del-overlay').classList.add('open');
}

// ACTUALLY DELETE THE TASK
function confirmDelete() {
  tasks = tasks.filter(x => x.id !== deletingId);
  save();
  render();
  document.getElementById('del-overlay').classList.remove('open');
  toast('deleted');
  deletingId = null;
}

// ---- event listeners ----

document.getElementById('open-new').addEventListener('click', () => openModal(null));
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-save').addEventListener('click', saveTask);

document.getElementById('del-cancel').addEventListener('click', () => {
  document.getElementById('del-overlay').classList.remove('open');
});
document.getElementById('del-confirm').addEventListener('click', confirmDelete);

// CLOSE MODAL WHEN CLICKING OUTSIDE
document.getElementById('task-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.getElementById('del-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) document.getElementById('del-overlay').classList.remove('open');
});

// CHARACTER COUNTER FOR NOTE TEXTAREA
document.getElementById('f-note').addEventListener('input', function() {
  document.getElementById('char-used').textContent = this.value.length;
});

// ESC TO CLOSE, CTRL+ENTER TO SAVE
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    document.getElementById('del-overlay').classList.remove('open');
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') saveTask();
});

// FILTER TABS
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.f;
    render();
  });
});

// TASK LIST CLICKS — ONE LISTENER HANDLES EVERYTHING (EVENT DELEGATION)
document.getElementById('task-list').addEventListener('click', e => {
  const edit     = e.target.closest('.edit-btn');
  const del      = e.target.closest('.del-btn');
  const check    = e.target.closest('.check-btn');
  const notePill = e.target.closest('.note-pill');
  const noteEdit = e.target.closest('.note-edit-link');

  if (edit)     { openModal(Number(edit.dataset.id));        return; }
  if (del)      { openDelete(Number(del.dataset.id));        return; }
  if (check)    { toggleDone(Number(check.dataset.id));      return; }
  if (notePill) { toggleNote(Number(notePill.dataset.id));   return; }
  if (noteEdit) { openModal(Number(noteEdit.dataset.id));    return; }
});

// DEMO TASKS SO IT DOESN'T OPEN EMPTY
function addDemoTasks() {
  if (tasks.length > 0) return;

  const now = Date.now();
  tasks = [
    {
      id: now - 3,
      title: 'finish the web dev assignment',
      note: 'need to add the responsive part still, css media queries. also fix the navbar on mobile because its broken.',
      priority: 'urgent',
      due: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      done: false,
      created: now - 3
    },
    {
      id: now - 2,
      title: 'buy groceries before dinner',
      note: 'eggs, milo, bread and maybe milk too.',
      priority: 'normal',
      due: '',
      done: false,
      created: now - 2
    },
    {
      id: now - 1,
      title: 'reply to group chat messages',
      note: '',
      priority: 'high',
      due: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      done: false,
      created: now - 1
    },
    {
      id: now,
      title: 'return library book',
      note: 'its been 2 weeks already',
      priority: 'normal',
      due: '',
      done: true,
      created: now
    }
  ];
  save();
}

// START EVERYTHING
load();
addDemoTasks();
render();
>>>>>>> Stashed changes
