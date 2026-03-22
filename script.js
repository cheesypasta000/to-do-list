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
