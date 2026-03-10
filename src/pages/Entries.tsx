import { useState, useEffect } from "react";
import { deleteEntry } from "../services/entries";
import { Menu } from "lucide-react";
import SideMenu from "../components/SideMenu";
import "../styles/entries.css";
import {
  type Entry,
  getTodayEntries,
  getWeeklyEntries,
  getRangeEntries,
  updateEntry,
} from "../services/entries";

export default function EntriesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"today" | "weekly" | "range">("today");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDid, setEditDid] = useState("");
  const [editLearned, setEditLearned] = useState("");

  useEffect(() => {
    fetchData("today");
  }, []);

  const fetchData = async (type: "today" | "weekly") => {
    try {
      setLoading(true);
      setMode(type);

      let data: Entry[] = [];

      if (type === "today") {
        data = await getTodayEntries();
      } else {
        data = await getWeeklyEntries();
      }

      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRange = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      setMode("range");

      const data = await getRangeEntries(startDate, endDate);
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch range entries", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);

      // remove from UI immediately
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete entry", err);
    }
  };
  const handleUpdate = async (
    id: number,
    updatedData: {
      title: string;
      what_did: string;
      what_learned: string;
    },
  ) => {
    try {
      const updatedEntry = await updateEntry(id, updatedData);

      // Update local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry,
        ),
      );

      console.log("Entry updated successfully");
    } catch (err) {
      console.error("Failed to update entry", err);
    }
  };

  return (
    <div className="entries-container">
      <Menu
        className="menu-icon"
        size={26}
        strokeWidth={2}
        onClick={() => setMenuOpen(true)}
      />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <h2 className="entries-title">Entries</h2>

      <div className="toggle-group">
        <button
          className={`toggle-btn ${mode === "today" ? "active" : ""}`}
          onClick={() => fetchData("today")}
        >
          Today
        </button>

        <button
          className={`toggle-btn ${mode === "weekly" ? "active" : ""}`}
          onClick={() => fetchData("weekly")}
        >
          Weekly
        </button>

        <button
          className={`toggle-btn ${mode === "range" ? "active" : ""}`}
          onClick={() => setMode("range")}
        >
          Range
        </button>
      </div>

      {mode === "range" && (
        <div className="range-controls">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="toggle-btn" onClick={fetchRange}>
            Fetch
          </button>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="empty-text">No entries found.</p>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h4>{entry.title}</h4>

                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(entry.id);
                      setEditTitle(entry.title);
                      setEditDid(entry.what_did);
                      setEditLearned(entry.what_learned);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {editingId === entry.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    value={editDid}
                    onChange={(e) => setEditDid(e.target.value)}
                  />

                  <textarea
                    value={editLearned}
                    onChange={(e) => setEditLearned(e.target.value)}
                  />

                  <div className="edit-actions">
                    <button
                      onClick={() => {
                        handleUpdate(entry.id, {
                          title: editTitle,
                          what_did: editDid,
                          what_learned: editLearned,
                        });
                        setEditingId(null);
                      }}
                    >
                      Save
                    </button>

                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Did:</strong> {entry.what_did}
                  </p>
                  <p>
                    <strong>Learned:</strong> {entry.what_learned}
                  </p>
                </>
              )}

              <div className="entry-date">{entry.entryDate}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
