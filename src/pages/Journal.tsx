import { useState, useEffect } from "react";
import CalendarSection from "../components/CalendarSection";
import EntrySidebar from "../components/EntrySidebar";
import AddEntryModal from "../components/AddEntryModal";
import { getEntriesByDate, createEntry, type Entry } from "../services/entries";
import "../styles/journal.css";
import { Menu } from "lucide-react";
import SideMenu from "../components/SideMenu";

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch entries for selected date
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const date = selectedDate.toISOString().split("T")[0];
        const data = await getEntriesByDate(date);
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch entries", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedDate]);

  // Entries are already filtered by date from the API
  const filteredEntries = entries;

  const handleAddEntry = async (
    title: string,
    what_did: string,
    what_learned: string,
  ) => {
    try {
      const entryDate = selectedDate.toISOString().split("T")[0];
      const newEntry = await createEntry({
        title,
        what_did,
        what_learned,
        entryDate,
      });

      setEntries((prev) => [...prev, newEntry]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create entry", err);
    }
  };

  return (
    <div className="page-shell">
      {/* Floating menu button */}
      <Menu
        className="menu-icon"
        size={26}
        strokeWidth={2}
        onClick={() => setMenuOpen(true)}
      />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="page-container">
        <div className="journal-grid">
          <CalendarSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <EntrySidebar
            selectedDate={selectedDate}
            entries={filteredEntries}
            onAddClick={() => setIsModalOpen(true)}
            loading={loading}
          />
        </div>
      </div>

      {isModalOpen && (
        <AddEntryModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEntry}
        />
      )}
    </div>
  );
}
