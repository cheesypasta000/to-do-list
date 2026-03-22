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
