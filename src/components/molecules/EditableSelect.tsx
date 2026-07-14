import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Settings, Check, X, Trash2 } from "lucide-react";

export interface EditableOptionBase {
  id: string;
  text: string;
}

export interface EditableSelectProps<T extends EditableOptionBase> {
  title?: string;
  options: T[];
  onOptionsChange: (options: T[]) => void;
  
  isMulti?: boolean;
  value: string | string[];
  onChange: (val: any) => void;
  
  renderOptionContent: (opt: T, isSelected?: boolean) => React.ReactNode;
  renderEditForm: (opt: T, onSave: (updated: T) => void, onCancel: () => void) => React.ReactNode;
  renderAddForm: (onAdd: (newOpt: T) => void) => React.ReactNode;

  isSettingsExpanded?: boolean;
  onToggleSettings?: () => void;
  hideSettingsIcon?: boolean;
  hideSelectBox?: boolean;
}

export function EditableSelect<T extends EditableOptionBase>({
  title,
  options,
  onOptionsChange,
  isMulti = false,
  value,
  onChange,
  renderOptionContent,
  renderEditForm,
  renderAddForm,
  isSettingsExpanded,
  onToggleSettings,
  hideSettingsIcon,
  hideSelectBox
}: EditableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Settings states
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = isSettingsExpanded !== undefined ? isSettingsExpanded : internalExpanded;
  const toggleSettings = onToggleSettings || (() => setInternalExpanded(!internalExpanded));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        (!portalRef.current || !portalRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setIsOpen(false);
    if (isOpen) window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) {
      setRect(e.currentTarget.getBoundingClientRect());
      setIsOpen(true);
      if (expanded) {
        toggleSettings();
      }
    } else {
      setIsOpen(false);
    }
  };

  const isSelected = (id: string) => {
    if (isMulti && Array.isArray(value)) return value.includes(id);
    return value === id;
  };

  const handleSelect = (id: string) => {
    if (isMulti && Array.isArray(value)) {
      if (value.includes(id)) {
        onChange(value.filter(v => v !== id));
      } else {
        onChange([...value, id]);
      }
    } else {
      onChange(id);
      setIsOpen(false);
    }
  };

  const handleDeleteOption = (id: string) => {
    onOptionsChange(options.filter((o) => o.id !== id));
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter(v => v !== id));
    } else if (value === id) {
      onChange(""); 
    }
    setDeletingId(null);
  };

  const selectedOptions = options.filter(o => isSelected(o.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} ref={dropdownRef}>
      {title && <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "2px" }}>{title}</label>}

      {/* Header */}
      {!hideSelectBox && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
          <div
          onClick={(e) => {
            if (expanded) return;
            toggleOpen(e);
          }}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            background: expanded ? "#f8fafc" : "#fff",
            border: isOpen ? "1.5px solid var(--primary)" : "1.5px solid #cbd5e1",
            borderRadius: "10px",
            cursor: expanded ? "not-allowed" : "pointer",
            opacity: expanded ? 0.6 : 1,
            pointerEvents: expanded ? "none" : "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "42px",
            transition: "all 0.2s"
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", flex: 1, minWidth: 0 }}>
            {selectedOptions.length > 0 ? (
              isMulti ? (
                selectedOptions.map(s => <React.Fragment key={s.id}>{renderOptionContent(s)}</React.Fragment>)
              ) : (
                renderOptionContent(selectedOptions[0])
              )
            ) : (
              <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Chọn...</span>
            )}
          </div>
          <ChevronDown size={16} color="#64748b" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>

        {!hideSettingsIcon && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              toggleSettings();
            }}
            style={{
              padding: "0 12px",
              border: expanded ? "1.5px solid #16a34a" : "1.5px solid #e2e8f0",
              borderRadius: "10px",
              background: expanded ? "#dcfce3" : "#f8fafc",
              color: expanded ? "#16a34a" : "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              minHeight: "42px",
              transition: "all 0.15s"
            }}
            title="Tùy chỉnh danh sách"
          >
            <Settings size={18} />
          </button>
        )}
      </div>
      )}

      {/* Settings Panel */}
      {expanded && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.25rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Quản lý tùy chọn</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {options.map((opt) => (
              <div 
                key={opt.id} 
                style={{ 
                  display: "flex", 
                  gap: "0.5rem", 
                  alignItems: "center",
                  padding: "0.5rem",
                  margin: "0 -0.5rem",
                  borderRadius: "6px",
                  background: (editingId === opt.id || deletingId === opt.id) ? "#fff" : "transparent",
                  boxShadow: (editingId === opt.id || deletingId === opt.id) ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                  border: editingId === opt.id ? "1px solid #bbf7d0" : deletingId === opt.id ? "1px solid #fecaca" : "1px solid transparent",
                  opacity: ((editingId || deletingId) && editingId !== opt.id && deletingId !== opt.id) ? 0.4 : 1,
                  pointerEvents: ((editingId || deletingId) && editingId !== opt.id && deletingId !== opt.id) ? "none" : "auto",
                  transform: (editingId === opt.id || deletingId === opt.id) ? "scale(1.02)" : "scale(1)",
                  zIndex: (editingId === opt.id || deletingId === opt.id) ? 10 : 1,
                  position: "relative",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={() => setHoveredOptionId(opt.id)}
                onMouseLeave={() => setHoveredOptionId(null)}
                onDoubleClick={() => {
                  if (editingId || deletingId) return;
                  setEditingId(opt.id);
                }}
              >
                {editingId === opt.id ? (
                  <div style={{ flex: 1 }}>
                    {renderEditForm(
                      opt, 
                      (updated) => {
                        onOptionsChange(options.map(o => o.id === opt.id ? updated : o));
                        setEditingId(null);
                      }, 
                      () => setEditingId(null)
                    )}
                  </div>
                ) : deletingId === opt.id ? (
                  <div style={{ flex: 1, display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "#b91c1c", flex: 1, fontWeight: 500 }}>
                      Xác nhận xóa tùy chọn này?
                    </span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteOption(opt.id); }}
                        style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", padding: "4px" }}
                        title="Xác nhận xóa"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingId(null);
                        }}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                        title="Hủy"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    {renderOptionContent(opt)}
                  </div>
                )}
                
                {editingId !== opt.id && deletingId !== opt.id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeletingId(opt.id);
                    }}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#ef4444", 
                      cursor: "pointer", 
                      padding: "4px", 
                      display: "flex", 
                      alignItems: "center",
                      opacity: hoveredOptionId === opt.id ? 1 : 0,
                      transition: "opacity 0.2s"
                    }}
                    title="Xóa lựa chọn này"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {options.length === 0 && <div style={{ color: "#15803d", fontStyle: "italic", fontSize: "0.85rem" }}>Chưa có tùy chọn nào.</div>}
          </div>

          <div style={{ borderTop: "1px dashed #bbf7d0" }} />

          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.5rem",
            opacity: (editingId || deletingId) ? 0.4 : 1,
            pointerEvents: (editingId || deletingId) ? "none" : "auto",
            transition: "all 0.2s ease"
          }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#166534" }}>Thêm tùy chọn mới</label>
            {renderAddForm((newOpt) => {
              onOptionsChange([...options, newOpt]);
            })}
          </div>
        </div>
      )}

      {/* Dropdown Portal */}
      {isOpen && rect && createPortal(
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setIsOpen(false)} />
          <div
            ref={portalRef}
            style={{
              position: "fixed",
              zIndex: 99999,
              top: rect.bottom + 4,
              left: rect.left,
              width: Math.max(rect.width, 240),
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            {options.length === 0 ? (
              <div style={{ padding: "0.75rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Chưa có lựa chọn nào
              </div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isSelected(opt.id) ? "#f1f5f9" : "transparent",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = isSelected(opt.id) ? "#f1f5f9" : "transparent")}
                >
                  <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    {renderOptionContent(opt, isSelected(opt.id))}
                  </div>
                  {isSelected(opt.id) && <Check size={16} color="var(--primary)" />}
                </div>
              ))
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
