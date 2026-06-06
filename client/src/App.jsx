import React, { useState, useCallback } from 'react';
import './index.css';
import './App.css';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import ConfirmDialog from './components/ConfirmDialog';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function App() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null); // { id, title }

  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask } =
    useTasks(filter, search);

  // Counts always from "all" tasks — we track separately via unfiltered counts
  const activeCount = tasks.filter((t) => !t.completed && filter !== 'completed').length;
  const completedCount = tasks.filter((t) => t.completed && filter !== 'active').length;

  function handleDeleteRequest(id, title) {
    setConfirm({ id, title });
  }

  async function handleConfirmDelete() {
    if (!confirm) return;
    await deleteTask(confirm.id);
    setConfirm(null);
  }

  // Debounce-like: update search after every keystroke (server filters)
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="logo">Task<span>Flow</span></div>
          <div className="stats-badge">
            <span className="stat">
              <span className="stat-dot active" />
              {filter === 'completed' ? 0 : tasks.filter(t => !t.completed).length} active
            </span>
            <span className="stat">
              <span className="stat-dot done" />
              {filter === 'active' ? 0 : tasks.filter(t => t.completed).length} done
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Toolbar: search + filters */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="search"
              placeholder="Search tasks…"
              value={search}
              onChange={handleSearch}
              aria-label="Search tasks"
            />
          </div>
          <div className="filter-tabs" role="tablist">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                className={`filter-tab ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Add task */}
        {filter !== 'completed' && (
          <TaskForm onCreate={createTask} />
        )}

        {/* Error */}
        {error && (
          <div className="error-banner">
            ⚠ {error}
          </div>
        )}

        {/* Task list */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>Loading tasks…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {filter === 'completed' ? '🏆' : filter === 'active' ? '✨' : '📋'}
            </div>
            <h3>
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'No active tasks'
                : search
                ? 'No tasks match your search'
                : 'No tasks yet'}
            </h3>
            <p>
              {filter === 'all' && !search
                ? 'Add your first task above to get started.'
                : 'Try a different filter or search term.'}
            </p>
          </div>
        ) : (
          <div className="task-list" role="list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      {confirm && (
        <ConfirmDialog
          message={`Delete "${confirm.title}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
