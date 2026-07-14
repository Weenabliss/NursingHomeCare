import React, { useState } from "react";
import { EditableSelect } from "../../../../shared/components/EditableSelect";
import { Check, X } from "lucide-react";

export interface HealthOption {
  id: string; // was value
  text: string; // was label
  color: string;
}

const DEFAULT_HEALTH_OPTIONS: HealthOption[] = [
  { text: "Bình thường", id: "normal", color: "#10b981" },
  { text: "Cần chú ý", id: "attention", color: "#f59e0b" },
  { text: "Nguy kịch", id: "critical", color: "#ef4444" },
];

const HEALTH_COLORS = [
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
  "#f59e0b", "#f97316", "#ef4444", "#ec4899",
  "#8b5cf6", "#a855f7", "#6366f1", "#64748b",
];

export const HealthSelect: React.FC<{
  title?: string;
  value: string;
  onChange: (value: string, color: string) => void;
  options?: HealthOption[];
  onOptionsChange?: (options: HealthOption[]) => void;
  isSettingsExpanded?: boolean;
  onToggleSettings?: () => void;
}> = ({ 
  title = "Tình trạng sức khỏe", 
  value, 
  onChange, 
  options: externalOptions, 
  onOptionsChange: externalOptionsChange,
  isSettingsExpanded,
  onToggleSettings
}) => {
  // Allow component to be fully controlled or manage its own options state
  const [internalOptions, setInternalOptions] = useState<HealthOption[]>(DEFAULT_HEALTH_OPTIONS);
  const options = externalOptions || internalOptions;
  const setOptions = externalOptionsChange || setInternalOptions;

  return (
    <EditableSelect
      title={title}
      options={options}
      onOptionsChange={setOptions}
      isMulti={false}
      value={value}
      onChange={(id) => {
        const opt = options.find((o) => o.id === id);
        onChange(id, opt ? opt.color : "#10b981");
      }}
      isSettingsExpanded={isSettingsExpanded}
      onToggleSettings={onToggleSettings}
      renderOptionContent={(opt, isSelected) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, userSelect: "none" }}>
          {opt.color !== "transparent" && (
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: opt.color, flexShrink: 0 }} />
          )}
          <span style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: isSelected ? 600 : 400, flex: 1 }}>
            {opt.text}
          </span>
        </div>
      )}
      renderEditForm={(opt, onSave, onCancel) => {
        return <HealthEditForm opt={opt} onSave={onSave} onCancel={onCancel} />;
      }}
      renderAddForm={(onAdd) => {
        return <HealthAddForm onAdd={onAdd} />;
      }}
    />
  );
};

const HealthEditForm = ({ opt, onSave, onCancel }: { opt: HealthOption, onSave: (o: HealthOption) => void, onCancel: () => void }) => {
  const [text, setText] = useState(opt.text);
  const [color, setColor] = useState(opt.color);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave({ ...opt, text, color });
            else if (e.key === "Escape") onCancel();
          }}
          style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
          placeholder="Tên trạng thái..."
        />
        <div style={{ display: "flex", gap: "2px" }}>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave({ ...opt, text, color }); }} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: "4px" }}>
            <Check size={16} />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel(); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
            <X size={16} />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {HEALTH_COLORS.map((c) => (
          <div
            key={c}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setColor(c);
            }}
            style={{
              width: "24px", height: "24px", borderRadius: "50%", background: c, cursor: "pointer",
              border: color === c ? "2px solid #1e293b" : "2px solid rgba(0,0,0,0.08)",
              boxShadow: color === c ? "0 0 0 2px white inset" : "none",
              transform: color === c ? "scale(1.15)" : "scale(1)",
              transition: "all 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HealthAddForm = ({ onAdd }: { onAdd: (o: HealthOption) => void }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState(HEALTH_COLORS[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tên trạng thái..."
          style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (text.trim()) {
              onAdd({ id: `custom_${Date.now()}`, text: text.trim(), color });
              setText("");
              setColor(HEALTH_COLORS[0]);
            }
          }}
          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", padding: "0 1rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
        >
          Thêm
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {HEALTH_COLORS.map((c) => (
          <div
            key={c}
            onClick={(e) => {
              e.preventDefault();
              setColor(c);
            }}
            style={{
              width: "24px", height: "24px", borderRadius: "50%", background: c, cursor: "pointer",
              border: color === c ? "2px solid #1e293b" : "2px solid rgba(0,0,0,0.08)",
              boxShadow: color === c ? "0 0 0 2px white inset" : "none",
              transform: color === c ? "scale(1.15)" : "scale(1)",
              transition: "all 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
};
