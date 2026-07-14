import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Settings, Check, X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./EditableSelect.module.scss";

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

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
      if (expanded) toggleSettings();
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
    <div className={styles.container} ref={dropdownRef}>
      {title && <label className={styles.label}>{title}</label>}

      {!hideSelectBox && (
        <div className={styles.header}>
          <div
            className={`${styles.selectBox} ${isOpen ? styles.open : ""} ${expanded ? styles.disabled : ""}`}
            onClick={(e) => { if (!expanded) toggleOpen(e); }}
          >
            <div className={styles.selectContent}>
              {selectedOptions.length > 0 ? (
                isMulti ? (
                  selectedOptions.map(s => <React.Fragment key={s.id}>{renderOptionContent(s)}</React.Fragment>)
                ) : (
                  renderOptionContent(selectedOptions[0])
                )
              ) : (
                <span className={styles.placeholder}>{t("editableSelect.placeholder")}</span>
              )}
            </div>
            <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.open : ""}`} />
          </div>

          {!hideSettingsIcon && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                toggleSettings();
              }}
              className={`${styles.settingsBtn} ${expanded ? styles.active : ""}`}
              title="Tùy chỉnh danh sách"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      )}

      {expanded && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsTitle}>{t("editableSelect.manageOptions")}</div>
          
          <div className={styles.optionList}>
            {options.map((opt) => {
              const isEditing = editingId === opt.id;
              const isDeleting = deletingId === opt.id;
              const anyActive = editingId || deletingId;
              const isDimmed = anyActive && !isEditing && !isDeleting;

              return (
                <div 
                  key={opt.id} 
                  className={`${styles.optionItem} ${isEditing ? styles.isEditing : ""} ${isDeleting ? styles.isDeleting : ""} ${isDimmed ? styles.dimmed : ""}`}
                  onMouseEnter={() => setHoveredOptionId(opt.id)}
                  onMouseLeave={() => setHoveredOptionId(null)}
                  onDoubleClick={() => {
                    if (editingId || deletingId) return;
                    setEditingId(opt.id);
                  }}
                >
                  {isEditing ? (
                    <div className={styles.editWrapper}>
                      {renderEditForm(
                        opt, 
                        (updated) => {
                          onOptionsChange(options.map(o => o.id === opt.id ? updated : o));
                          setEditingId(null);
                        }, 
                        () => setEditingId(null)
                      )}
                    </div>
                  ) : isDeleting ? (
                    <div className={styles.deleteWrapper}>
                      <span className={styles.deleteConfirmText}>{t("editableSelect.confirmDelete")}</span>
                      <div className={styles.deleteActions}>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteOption(opt.id); }} className={`${styles.iconBtn} ${styles.danger}`} title="Xác nhận xóa">
                          <Check size={16} />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(null); }} className={`${styles.iconBtn} ${styles.muted}`} title="Hủy">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.contentWrapper}>
                      {renderOptionContent(opt)}
                    </div>
                  )}
                  
                  {!isEditing && !isDeleting && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(opt.id);
                      }}
                      className={`${styles.iconBtn} ${styles.danger} ${hoveredOptionId !== opt.id ? styles.hidden : ""}`}
                      title="Xóa lựa chọn này"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
            {options.length === 0 && <div className={styles.emptyState}>{t("editableSelect.noOptions")}</div>}
          </div>

          <div className={styles.divider} />

          <div className={`${styles.addSection} ${(editingId || deletingId) ? styles.dimmed : ""}`}>
            <label className={styles.addLabel}>{t("editableSelect.addOption")}</label>
            {renderAddForm((newOpt) => {
              onOptionsChange([...options, newOpt]);
            })}
          </div>
        </div>
      )}

      {isOpen && rect && createPortal(
        <>
          <div className={styles.portalOverlay} onClick={() => setIsOpen(false)} />
          <div
            ref={portalRef}
            className={styles.portalContent}
            style={{ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 240) }}
          >
            {options.length === 0 ? (
              <div className={styles.portalEmpty}>{t("editableSelect.noChoices")}</div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`${styles.portalItem} ${isSelected(opt.id) ? styles.selected : ""}`}
                >
                  <div className={styles.portalItemContent}>
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
