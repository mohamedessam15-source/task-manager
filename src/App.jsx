import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Stats from './components/Stats';

const FILTERS = ['All', 'Active', 'Completed'];
const RANK = { High: 0, Medium: 1, Low: 2 };
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [theme, setTheme] = useLocalStorage('theme', prefersDark ? 'dark' : 'light');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [query, setQuery] = useState('');
  const [undo, setUndo] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Hide the "Undo" message after 5 seconds
  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(timer);
  }, [undo]);

  const addTask = (task) => setTasks([{ id: crypto.randomUUID(), done: false, ...task }, ...tasks]);
  const updateTask = (id, changes) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const clearCompleted = () => setTasks(tasks.filter((t) => !t.done));

  const deleteTask = (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    setUndo({ task: tasks[index], index });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const undoDelete = () => {
    const restored = [...tasks];
    restored.splice(undo.index, 0, undo.task);
    setTasks(restored);
    setUndo(null);
  };

  const visible = useMemo(() => {
    const list = tasks.filter((t) => {
      const matchesFilter = filter === 'All' || (filter === 'Active' ? !t.done : t.done);
      return matchesFilter && t.title.toLowerCase().includes(query.trim().toLowerCase());
    });
    if (sort === 'Priority') list.sort((a, b) => RANK[a.priority] - RANK[b.priority]);
    if (sort === 'Due date') list.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
    return list;
  }, [tasks, filter, sort, query]);

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <svg className="logo" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" rx="7" fill="currentColor" />
            <path
              d="M7 12.5l3.2 3.2L17 9"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: 'var(--on-accent)' }}
            />
          </svg>
          <div>
            <h1>Task Manager</h1>
            <p className="sub">Plan your day and track your progress</p>
          </div>
        </div>
        <button className="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <Stats tasks={tasks} />
      <TaskForm onAdd={addTask} />

      <div className="tools">
        <input
          type="search"
          placeholder="Search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tasks"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
          <option>Newest</option>
          <option>Due date</option>
          <option>Priority</option>
        </select>
        <div className="tabs" role="group" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={f === filter ? 'tab active' : 'tab'}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="empty">
          {tasks.length === 0 ? 'No tasks yet. Add your first task above.' : 'No tasks match your search or filter.'}
        </p>
      ) : (
        <ul className="list">
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}

      {tasks.some((t) => t.done) && (
        <button className="link" onClick={clearCompleted}>Clear completed</button>
      )}

      {undo && (
        <div className="toast" role="status">
          Task deleted
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}
    </div>
  );
}
