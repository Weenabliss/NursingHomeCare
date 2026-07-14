import React, { useState } from "react";
import { EditableSelect } from "../../../../shared/components/EditableSelect";
import { Check, X } from "lucide-react";

export interface SeverityOption {
  id: string;
  text: string;
  level: number;
}

export const PALETTES = {
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e3a8a"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#7e22ce", "#581c87"],
};

export const SeveritySelect: React.FC<{
  title: string;
  palette: "blue" | "purple";
  selected: SeverityOption[];
  onChange: (selected: SeverityOption[]) => void;
  options: SeverityOption[];
  onOptionsChange: (options: SeverityOption[]) => void;
  isSettingsExpanded?: boolean;
  onToggleSettings?: () => void;
}> = ({ title, palette, selected, onChange, options, onOptionsChange, isSettingsExpanded, onToggleSettings }) => {
  const colors = PALETTES[palette];

  return (
    <EditableSelect
      title={title}
      options={options}
      onOptionsChange={onOptionsChange}
      isMulti={false}
      value={selected.length > 0 ? selected[0].id : ""}
      onChange={(id) => {
        const opt = options.find((o) => o.id === id);
        onChange(opt ? [opt] : []);
      }}
      isSettingsExpanded={isSettingsExpanded}
      onToggleSettings={onToggleSettings}
      renderOptionContent={(opt, isSelected) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "text", userSelect: "none", flex: 1 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[opt.level - 1], flexShrink: 0, marginRight: "4px" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: isSelected ? 600 : 400 }}>{opt.text}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(Mức {opt.level})</span>
        </div>
      )}
      renderEditForm={(opt, onSave, onCancel) => {
        return <SeverityEditForm opt={opt} onSave={onSave} onCancel={onCancel} />;
      }}
      renderAddForm={(onAdd) => {
        return <SeverityAddForm onAdd={onAdd} />;
      }}
    />
  );
};

const SeverityEditForm = ({ opt, onSave, onCancel }: { opt: SeverityOption, onSave: (o: SeverityOption) => void, onCancel: () => void }) => {
  const [text, setText] = useState(opt.text);
  const [level, setLevel] = useState(opt.level);
  
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flex: 1 }}>
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave({ ...opt, text, level });
          else if (e.key === "Escape") onCancel();
        }}
        style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
        placeholder="Tên trạng thái..."
      />
      <select
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        style={{ padding: "0.4rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem", background: "#fff", cursor: "pointer", maxWidth: "80px" }}
      >
        {[1,2,3,4,5,6,7,8].map(l => <option key={l} value={l}>Mức {l}</option>)}
      </select>
      <div style={{ display: "flex", gap: "2px" }}>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave({ ...opt, text, level }); }} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: "4px" }}>
          <Check size={16} />
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel(); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const SeverityAddForm = ({ onAdd }: { onAdd: (o: SeverityOption) => void }) => {
  const [text, setText] = useState("");
  const [level, setLevel] = useState(1);

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tên trạng thái..."
        style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
      />
      <select
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem", background: "#fff", cursor: "pointer", maxWidth: "80px" }}
      >
        {[1,2,3,4,5,6,7,8].map(l => <option key={l} value={l}>Mức {l}</option>)}
      </select>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (text.trim()) {
            onAdd({ id: `new_${Date.now()}`, text: text.trim(), level });
            setText("");
            setLevel(1);
          }
        }}
        style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", padding: "0 1rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
      >
        Thêm
      </button>
    </div>
  );
};
