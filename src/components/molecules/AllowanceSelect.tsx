import React, { useState } from "react";
import { EditableSelect } from "./EditableSelect";
import { Check, X, Plus } from "lucide-react";
import { usePayroll } from "../../contexts/PayrollContext";

export interface AllowanceOptionType {
  id: string;
  text: string;
  amount: number;
}

export const AllowanceSelect: React.FC<{
  title?: string;
  value: string;
  onChange: (id: string, name: string, amount: number) => void;
  isSettingsExpanded?: boolean;
  onToggleSettings?: () => void;
  hideSettingsIcon?: boolean;
  hideSelectBox?: boolean;
}> = ({ title, value, onChange, isSettingsExpanded, onToggleSettings, hideSettingsIcon, hideSelectBox }) => {
  const { allowanceTypes, setAllowanceTypes } = usePayroll();

  const options: AllowanceOptionType[] = allowanceTypes.map((a) => ({
    id: a.id,
    text: a.name,
    amount: a.amount || 0,
  }));

  const handleOptionsChange = (newOptions: AllowanceOptionType[]) => {
    // EditableSelect returns the full updated list when deleting or updating.
    // For simplicity, we sync the whole list back.
    setAllowanceTypes(
      newOptions.map((o) => ({
        id: o.id,
        name: o.text,
        amount: o.amount,
      }))
    );
  };

  return (
    <EditableSelect
      title={title}
      options={options}
      onOptionsChange={handleOptionsChange}
      isMulti={false}
      value={value}
      onChange={(id) => {
        const opt = options.find((o) => o.id === id);
        if (opt) {
          onChange(id, opt.text, opt.amount);
        } else {
          onChange(id, "", 0);
        }
      }}
      isSettingsExpanded={isSettingsExpanded}
      onToggleSettings={onToggleSettings}
      hideSettingsIcon={hideSettingsIcon}
      hideSelectBox={hideSelectBox}
      renderOptionContent={(opt, isSelected) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, userSelect: "none" }}>
          <span style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: isSelected ? 600 : 400 }}>
            {opt.text}
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {new Intl.NumberFormat("vi-VN").format(opt.amount)} đ
          </span>
        </div>
      )}
      renderEditForm={(opt, onSave, onCancel) => {
        return <AllowanceEditForm opt={opt} onSave={onSave} onCancel={onCancel} />;
      }}
      renderAddForm={(onAdd) => {
        return <AllowanceAddForm onAdd={onAdd} />;
      }}
    />
  );
};

const AllowanceEditForm = ({ opt, onSave, onCancel }: { opt: AllowanceOptionType, onSave: (o: AllowanceOptionType) => void, onCancel: () => void }) => {
  const [text, setText] = useState(opt.text);
  const [amount, setAmount] = useState(opt.amount);
  
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flex: 1 }}>
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave({ ...opt, text, amount });
          else if (e.key === "Escape") onCancel();
        }}
        style={{ flex: 2, width: "0", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
        placeholder="Tên trợ cấp..."
      />
      <input
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave({ ...opt, text, amount });
          else if (e.key === "Escape") onCancel();
        }}
        style={{ flex: 1, width: "0", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bbf7d0", outline: "none", fontSize: "0.85rem" }}
        placeholder="Số tiền..."
      />
      <div style={{ display: "flex", gap: "2px" }}>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave({ ...opt, text, amount }); }} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: "4px" }}>
          <Check size={16} />
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel(); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const AllowanceAddForm = ({ onAdd }: { onAdd: (o: AllowanceOptionType) => void }) => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState<number>(0);
  
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            onAdd({ id: `ALLW-${Date.now()}`, text: text.trim(), amount });
            setText("");
            setAmount(0);
          }
        }}
        style={{ flex: 2, width: "0", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.85rem" }}
        placeholder="Tên trợ cấp..."
      />
      <input
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            onAdd({ id: `ALLW-${Date.now()}`, text: text.trim(), amount });
            setText("");
            setAmount(0);
          }
        }}
        style={{ flex: 1, width: "0", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.85rem" }}
        placeholder="Số tiền..."
      />
      <button 
        onClick={(e) => { 
          e.preventDefault(); 
          if (text.trim()) {
            onAdd({ id: `ALLW-${Date.now()}`, text: text.trim(), amount });
            setText("");
            setAmount(0);
          }
        }}
        disabled={!text.trim()}
        style={{ background: "var(--primary)", border: "none", color: "#fff", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", opacity: text.trim() ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
