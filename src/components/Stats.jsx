export default function Stats({ tasks }) {
  const today = new Date().toISOString().slice(0, 10);
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const overdue = tasks.filter((t) => !t.done && t.due && t.due < today).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const items = [
    ['Total', total],
    ['Active', total - done],
    ['Completed', done],
    ['Overdue', overdue],
  ];

  return (
    <section className="stats" aria-label="Task summary">
      <div className="cards">
        {items.map(([label, value]) => (
          <div key={label} className={label === 'Overdue' && value > 0 ? 'stat alert' : 'stat'}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div style={{ width: `${percent}%` }} />
      </div>
      <p className="sub">{percent}% complete</p>
    </section>
  );
}
