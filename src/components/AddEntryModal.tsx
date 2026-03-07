import { useState } from "react";

interface Props {
  onClose: () => void;
  onSave: (title: string, what_did: string, what_learned: string) => void;
}

export default function AddEntryModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [whatDid, setWhatDid] = useState("");
  const [whatLearned, setWhatLearned] = useState("");

  const handleSave = () => {
    if (!title.trim() || !whatDid.trim() || !whatLearned.trim()) return;

    onSave(title, whatDid, whatLearned);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-card stack">
        <h3>New Entry</h3>

        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-input form-textarea"
          placeholder="What did you do?"
          value={whatDid}
          onChange={(e) => setWhatDid(e.target.value)}
        />

        <textarea
          className="form-input form-textarea"
          placeholder="What did you learn?"
          value={whatLearned}
          onChange={(e) => setWhatLearned(e.target.value)}
        />

        <div className="row">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
