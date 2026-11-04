import { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.title);
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task.due && !task.done && task.due < today;

  const save = () => {
    if (text.trim()) onUpdate(task.id, { title: text.trim() });
    else setText(task.title);
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') {
      setText(task.title);
      setEditing(false);
    }
  };

  return (
    <li className={`item p-${task.priority.toLowerCase()}${task.done ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onUpdate(task.id, { done: !task.done })}
        aria-label={`Mark "${task.title}" as done`}
      />
      <div className="body">
        {editing ? (
          <input
            className="edit"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
            onKeyDown={onKeyDown}
            aria-label="Edit task"
          />
        ) : (
          <span className="title">{task.title}</span>
        )}
        <span className="meta">
          <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
          {task.due && (
            <span className={overdue ? 'overdue' : ''}>
              {overdue ? 'Overdue: ' : 'Due '}
              {task.due}
            </span>
          )}
        </span>
      </div>
      <button className="ghost" onClick={() => setEditing(true)}>Edit</button>
      <button className="ghost danger" onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
