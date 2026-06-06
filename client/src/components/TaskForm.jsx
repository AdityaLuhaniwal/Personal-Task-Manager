import React, { useState } from 'react';
import { todayISO } from '../utils/dateUtils';

const EMPTY_FORM = { title: '', description: '', dueDate: '' };

export default function TaskForm({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null,
      });
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="add-task-section">
        <button className="add-task-toggle" onClick={() => setOpen(true)}>
          <span style={{ fontSize: '1.1rem' }}>＋</span>
          Add a new task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task-section">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details…"
              rows={2}
            />
          </div>
          <div className="form-field">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {formError && (
          <div className="error-banner">⚠ {formError}</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => { setOpen(false); setForm(EMPTY_FORM); }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
