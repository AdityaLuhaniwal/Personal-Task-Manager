import React, { useState } from 'react';
import { isOverdue, formatDate } from '../utils/dateUtils';

export default function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const overdue = isOverdue(task.dueDate, task.completed);

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setEditError('Title is required.');
      return;
    }
    setSaving(true);
    try {
      await onUpdate(task.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        dueDate: editForm.dueDate || null,
      });
      setEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="task-main">
        {/* Checkbox */}
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id, task.completed)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />

        {/* Content */}
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-date ${overdue ? 'overdue' : ''}`}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}
            {overdue && <span className="overdue-badge">Overdue</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          <button
            className="icon-btn"
            onClick={() => setEditing((v) => !v)}
            aria-label="Edit task"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDelete(task.id, task.title)}
            aria-label="Delete task"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <form className="task-edit-form" onSubmit={handleSave}>
          <div className="form-field">
            <label>Title *</label>
            <input
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              autoFocus
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows={2}
              />
            </div>
            <div className="form-field">
              <label>Due Date</label>
              <input
                name="dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={handleEditChange}
              />
            </div>
          </div>
          {editError && <div className="error-banner">⚠ {editError}</div>}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
