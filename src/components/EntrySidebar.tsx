import type { Entry } from "../services/entries";

interface Props {
  selectedDate: Date;
  entries: Entry[];
  onAddClick: () => void;
  loading: boolean;
}

export default function EntrySidebar({
  selectedDate,
  entries,
  onAddClick,
  loading,
}: Props) {
  return (
    <div className="card sidebar">
      <h2>Entries</h2>

      <div className="selected-date">
        <span className="label">Selected Date </span>
        <span className="date">{selectedDate.toDateString()}</span>
      </div>

      <div className="entries-placeholder">
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No entries for this day.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <h4>{entry.title}</h4>
              <p>
                <strong>Did:</strong> {entry.what_did}
              </p>
              <p>
                <strong>Learned:</strong> {entry.what_learned}
              </p>
            </div>
          ))
        )}
      </div>

      <button className="btn btn-primary" onClick={onAddClick}>
        + Add Entry
      </button>
    </div>
  );
}
