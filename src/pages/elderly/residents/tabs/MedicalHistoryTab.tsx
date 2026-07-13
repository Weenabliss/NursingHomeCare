import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertCircle,
  Pill,
  Stethoscope,
  Brain,
  Accessibility,
  ChevronDown,
  Settings,
  Trash2,
  Plus,
  Check,
  X,
} from "lucide-react";
import { BaseCard } from "../../../../components/atoms/BaseCard";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../../components/atoms/BaseSelect";
import { InfoField } from "../../../../components/atoms/InfoField";
import { useFormModal } from "../../../../hooks/useFormModal";
import type { Resident } from "../../../../mock/residents";

interface MedicalHistoryTabProps {
  resident: Resident;
}

// Mock Data for Timeline
const medicalEvents = [
  {
    id: 1,
    date: "2023-10-15",
    title: "Khám tổng quát định kỳ",
    doctor: "BS. Trần Văn A",
    notes: "Huyết áp hơi cao, cần theo dõi chế độ ăn nhạt.",
    type: "checkup",
  },
  {
    id: 2,
    date: "2023-08-02",
    title: "Cấp cứu do hạ đường huyết",
    doctor: "BS. Nguyễn Thị B",
    notes: "Truyền dịch, ổn định sau 2 giờ. Cập nhật lại liều lượng Insulin.",
    type: "emergency",
  },
  {
    id: 3,
    date: "2023-01-10",
    title: "Nhập viện điều trị viêm phổi",
    doctor: "BS. Lê Văn C",
    notes: "Điều trị nội trú 7 ngày tại BV Đa Khoa Tỉnh.",
    type: "hospital",
  },
];

const mobilityMap: Record<string, string> = {
  normal: "Bình thường",
  wheelchair: "Cần xe lăn",
  bedridden: "Nằm liệt giường",
};

const cognitiveMap: Record<string, string> = {
  lucid: "Minh mẫn",
  confused: "Lú lẫn",
  dementia: "Sa sút trí tuệ",
};

const bloodTypeCharacteristics: Record<string, string> = {
  "A+": "Nhận: A+, A-, O+, O- | Cho: A+, AB+",
  "A-": "Nhận: A-, O- | Cho: A+, A-, AB+, AB-",
  "B+": "Nhận: B+, B-, O+, O- | Cho: B+, AB+",
  "B-": "Nhận: B-, O- | Cho: B+, B-, AB+, AB-",
  "AB+": "Nhận: Tất cả nhóm máu | Cho: AB+",
  "AB-": "Nhận: A-, B-, AB-, O- | Cho: AB+, AB-",
  "O+": "Nhận: O+, O- | Cho: O+, A+, B+, AB+",
  "O-": "Nhận: O- | Cho: Tất cả nhóm máu",
};

const calculateBMI = (height: number, weight: number) => {
  if (!height || !weight) return { value: 0, label: "—", color: "var(--text-main)" };
  const h = height / 100;
  const bmi = weight / (h * h);
  let label = "Bình thường";
  let color = "#10b981"; // green
  if (bmi < 18.5) {
    label = "Thiếu cân";
    color = "#f59e0b";
  } else if (bmi >= 25 && bmi < 30) {
    label = "Thừa cân";
    color = "#f59e0b";
  } else if (bmi >= 30) {
    label = "Béo phì";
    color = "#ef4444";
  }
  return { value: bmi.toFixed(1), label, color };
};

export interface SeverityOption {
  id: string;
  text: string;
  level: number; // 1 to 8
}

const PALETTES = {
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e3a8a"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#7e22ce", "#581c87"],
};

const SeveritySelect: React.FC<{
  title: string;
  palette: "blue" | "purple";
  selected: SeverityOption[];
  onChange: (selected: SeverityOption[]) => void;
  options: SeverityOption[];
  onOptionsChange: (options: SeverityOption[]) => void;
}> = ({ title, palette, selected, onChange, options, onOptionsChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [manageModalOpen, setManageModalOpen] = React.useState(false);
  const [newText, setNewText] = React.useState("");
  const [newLevel, setNewLevel] = React.useState(1);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const colors = PALETTES[palette];
  const safeSelected = selected || [];
  const safeOptions = options || [];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (e: Event) => {
      const target = e.target as Node;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (isOpen) {
      window.addEventListener("scroll", handleScroll, { capture: true });
      window.addEventListener("resize", () => setIsOpen(false));
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  const toggleSelect = (opt: SeverityOption) => {
    if (safeSelected.some((s) => s.id === opt.id)) {
      onChange(safeSelected.filter((s) => s.id !== opt.id));
    } else {
      onChange([...safeSelected, opt]);
    }
  };

  const handleAddOption = () => {
    if (!newText.trim()) return;
    onOptionsChange([...safeOptions, { id: Math.random().toString(), text: newText.trim(), level: newLevel }]);
    setNewText("");
    setNewLevel(1);
  };

  const handleDeleteOption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onOptionsChange(safeOptions.filter((o) => o.id !== id));
    onChange(safeSelected.filter((s) => s.id !== id));
  };

  const toggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) {
      setRect(e.currentTarget.getBoundingClientRect());
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} ref={dropdownRef}>
      <label style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>{title}</label>

      {/* Wrapper to hold Combobox and Settings Button */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {/* Combobox Header */}
        <div
          onClick={toggleOpen}
          style={{
            flex: 1,
            padding: "0.75rem",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "46px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {safeSelected.length > 0 ? (
              safeSelected.map((s) => (
                <span
                  key={s.id}
                  style={{
                    background: "#f1f5f9",
                    color: "var(--text-main)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[s.level - 1] }} />
                  {s.text}
                </span>
              ))
            ) : (
              <span style={{ color: "var(--text-muted)" }}>Chọn trạng thái...</span>
            )}
          </div>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>

        {/* Settings Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setManageModalOpen(true);
          }}
          style={{
            width: "46px",
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Dropdown Menu (Portal) */}
      {isOpen &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              zIndex: 9999,
              top: rect.bottom + 4,
              left: rect.left,
              width: rect.width, // Matches the combobox width, minus the settings button width
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              {safeOptions.map((opt) => {
                const isSel = safeSelected.some((s) => s.id === opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSelect(opt);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                      background: isSel ? "#f1f5f9" : "transparent",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: `2px solid ${isSel ? "var(--primary)" : "var(--border)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSel ? "var(--primary)" : "#fff",
                      }}
                    >
                      {isSel && <Check size={12} color="#fff" />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[opt.level - 1] }} />
                      <span style={{ color: "var(--text-main)", fontSize: "0.9rem", fontWeight: 500 }}>
                        {opt.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}

      {/* Management Modal */}
      <BaseModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        title={`Tùy chỉnh: ${title}`}
        confirmText="Đóng"
        onConfirm={() => setManageModalOpen(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* List of existing options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {safeOptions.map((opt) => (
              <div
                key={opt.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "#f8fafc",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: colors[opt.level - 1] }} />
                  <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 500 }}>{opt.text}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteOption(opt.id, e)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />

          {/* Add New Option Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Thêm tùy chọn mới</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Nhập tên trạng thái..."
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  outline: "none",
                  fontSize: "0.9rem",
                }}
              />
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
                style={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  outline: "none",
                  fontSize: "0.9rem",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value={1}>Mức 1 (Nhẹ nhất)</option>
                <option value={2}>Mức 2</option>
                <option value={3}>Mức 3</option>
                <option value={4}>Mức 4</option>
                <option value={5}>Mức 5</option>
                <option value={6}>Mức 6</option>
                <option value={7}>Mức 7</option>
                <option value={8}>Mức 8 (Nặng nhất)</option>
              </select>
              <button
                onClick={handleAddOption}
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 1rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ resident }) => {
  const { medicalHistory } = resident;
  const bmiInfo = useMemo(
    () => calculateBMI(medicalHistory.height, medicalHistory.weight),
    [medicalHistory.height, medicalHistory.weight]
  );

  // Form Modals Setup
  const metricsModal = useFormModal(
    useMemo(
      () => ({
        bloodType: medicalHistory.bloodType || "",
        height: medicalHistory.height?.toString() || "",
        weight: medicalHistory.weight?.toString() || "",
        bloodPressure: medicalHistory.latestVitals?.bloodPressure || "",
        spO2: medicalHistory.latestVitals?.spO2?.toString() || "",
        temperature: medicalHistory.latestVitals?.temperature?.toString() || "",
      }),
      [medicalHistory]
    )
  );

  // Local dictionary state for options (defined first so they can be used below)
  const [mobilityOptions, setMobilityOptions] = React.useState<SeverityOption[]>([
    { id: "m-1", text: "Bình thường", level: 1 },
    { id: "m-2", text: "Chậm chạp, tự đi lại", level: 2 },
    { id: "m-3", text: "Cần người dìu", level: 3 },
    { id: "m-4", text: "Cần dùng gậy/khung", level: 4 },
    { id: "m-5", text: "Cần xe lăn (Tự đẩy)", level: 5 },
    { id: "m-6", text: "Cần xe lăn (Phụ thuộc)", level: 6 },
    { id: "m-7", text: "Hạn chế tại giường", level: 7 },
    { id: "m-8", text: "Nằm liệt giường", level: 8 },
  ]);

  const [cognitiveOptions, setCognitiveOptions] = React.useState<SeverityOption[]>([
    { id: "c-1", text: "Minh mẫn", level: 1 },
    { id: "c-2", text: "Hay quên nhẹ", level: 2 },
    { id: "c-3", text: "Suy giảm nhận thức nhẹ", level: 3 },
    { id: "c-4", text: "Lú lẫn (Thỉnh thoảng)", level: 4 },
    { id: "c-5", text: "Lú lẫn (Thường xuyên)", level: 5 },
    { id: "c-6", text: "Sa sút trí tuệ (Nhẹ)", level: 6 },
    { id: "c-7", text: "Sa sút trí tuệ (Nặng)", level: 7 },
    { id: "c-8", text: "Mất nhận thức hoàn toàn", level: 8 },
  ]);

  const [adlOptions, setAdlOptions] = React.useState<SeverityOption[]>([
    { id: "a-1", text: "Tự phục vụ hoàn toàn", level: 1 },
    { id: "a-2", text: "Cần nhắc nhở / giám sát", level: 2 },
    { id: "a-3", text: "Cần hỗ trợ một phần", level: 3 },
    { id: "a-4", text: "Phụ thuộc phần lớn", level: 4 },
    { id: "a-5", text: "Phụ thuộc hoàn toàn", level: 5 },
  ]);

  const [visionOptions, setVisionOptions] = React.useState<SeverityOption[]>([
    { id: "v-1", text: "Bình thường", level: 1 },
    { id: "v-2", text: "Giảm thị lực nhẹ", level: 2 },
    { id: "v-3", text: "Giảm thị lực vừa (Kính)", level: 3 },
    { id: "v-4", text: "Suy giảm nặng", level: 4 },
    { id: "v-5", text: "Mù lòa", level: 5 },
  ]);

  const [hearingOptions, setHearingOptions] = React.useState<SeverityOption[]>([
    { id: "h-1", text: "Bình thường", level: 1 },
    { id: "h-2", text: "Giảm thính lực nhẹ", level: 2 },
    { id: "h-3", text: "Lãng tai (Cần nói to)", level: 3 },
    { id: "h-4", text: "Giảm thính lực nặng (Máy)", level: 4 },
    { id: "h-5", text: "Điếc hoàn toàn", level: 5 },
  ]);

  // Use ref for initial data so it never re-computes and causes loops
  const initialFunctionalData = React.useRef<{ mobilityTags: SeverityOption[]; cognitiveTags: SeverityOption[] }>({
    mobilityTags: medicalHistory.mobilityStatus
      ? [{ id: "init-m", text: mobilityMap[medicalHistory.mobilityStatus] || medicalHistory.mobilityStatus, level: 2 }]
      : [],
    cognitiveTags: medicalHistory.cognitiveStatus
      ? [
          {
            id: "init-c",
            text: cognitiveMap[medicalHistory.cognitiveStatus] || medicalHistory.cognitiveStatus,
            level: 2,
          },
        ]
      : [],
  });

  const functionalModal = useFormModal({
    ...initialFunctionalData.current,
    adlTags: medicalHistory.adlStatus
      ? [{ id: "init-a", text: medicalHistory.adlStatus, level: 1 }]
      : [],
    visionTags: medicalHistory.sensoryStatus?.vision
      ? [{ id: "init-v", text: medicalHistory.sensoryStatus.vision, level: 1 }]
      : [],
    hearingTags: medicalHistory.sensoryStatus?.hearing
      ? [{ id: "init-h", text: medicalHistory.sensoryStatus.hearing, level: 1 }]
      : [],
  });

  const allergiesModal = useFormModal(
    useMemo(
      () => ({
        allergies: medicalHistory.allergies?.join(", ") || "",
      }),
      [medicalHistory]
    )
  );

  const diseasesModal = useFormModal(
    useMemo(
      () => ({
        chronicDiseases: medicalHistory.chronicDiseases?.join(", ") || "",
      }),
      [medicalHistory]
    )
  );

  const treatmentModal = useFormModal(
    useMemo(
      () => ({
        prescriptions: medicalHistory.prescriptions || [],
        medicalDevices: medicalHistory.medicalDevices || [],
      }),
      [medicalHistory]
    )
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Tổng quan Thể chất & Nhận thức */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "stretch" }}>
        {/* Chỉ số cơ thể */}
        <BaseCard style={{ height: "100%" }} isSelected={metricsModal.isOpen} onClick={metricsModal.openModal}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "var(--text-main)",
              fontSize: "1.05rem",
              fontWeight: 700,
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Activity size={18} color="var(--primary)" /> Chỉ số cơ thể
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField
              label="Nhóm máu"
              value={
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>
                    {metricsModal.committedData.bloodType || "—"}
                  </span>
                  {metricsModal.committedData.bloodType &&
                    bloodTypeCharacteristics[metricsModal.committedData.bloodType] && (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        {bloodTypeCharacteristics[metricsModal.committedData.bloodType]}
                      </span>
                    )}
                </div>
              }
            />
            <InfoField
              label="Chỉ số BMI"
              value={
                <span style={{ color: bmiInfo.color, fontWeight: 700 }}>
                  {bmiInfo.value} <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>({bmiInfo.label})</span>
                </span>
              }
            />
            <InfoField
              label="Chiều cao"
              value={metricsModal.committedData.height ? `${metricsModal.committedData.height} cm` : "—"}
            />
            <InfoField
              label="Cân nặng"
              value={metricsModal.committedData.weight ? `${metricsModal.committedData.weight} kg` : "—"}
            />
            <InfoField
              label="Huyết áp"
              value={metricsModal.committedData.bloodPressure ? `${metricsModal.committedData.bloodPressure} mmHg` : "—"}
            />
            <InfoField
              label="SpO2"
              value={metricsModal.committedData.spO2 ? `${metricsModal.committedData.spO2}%` : "—"}
            />
            <InfoField
              label="Nhiệt độ gần nhất"
              value={metricsModal.committedData.temperature ? `${metricsModal.committedData.temperature}°C` : "—"}
            />
          </div>
        </BaseCard>

        {/* Trạng thái Chức năng */}
        <BaseCard style={{ height: "100%" }} isSelected={functionalModal.isOpen} onClick={functionalModal.openModal}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "var(--text-main)",
              fontSize: "1.05rem",
              fontWeight: 700,
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Accessibility size={18} color="var(--primary)" /> Trạng thái Chức năng
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField
                label="Khả năng vận động"
                value={
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(functionalModal.committedData.mobilityTags || []).length > 0
                      ? (functionalModal.committedData.mobilityTags || []).map((t) => (
                          <span
                            key={t.id}
                            style={{
                              background: "#f8fafc",
                              color: "var(--text-main)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTES.blue[(t.level || 1) - 1] }} />
                            {t.text}
                          </span>
                        ))
                      : "—"}
                  </div>
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField
                label="Trạng thái nhận thức"
                value={
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(functionalModal.committedData.cognitiveTags || []).length > 0
                      ? (functionalModal.committedData.cognitiveTags || []).map((t) => (
                          <span
                            key={t.id}
                            style={{
                              background: "#f8fafc",
                              color: "var(--text-main)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTES.purple[(t.level || 1) - 1] }} />
                            {t.text}
                          </span>
                        ))
                      : "—"}
                  </div>
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
              <InfoField
                label="Khả năng tự phục vụ (ADL)"
                value={
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(functionalModal.committedData.adlTags || []).length > 0
                      ? (functionalModal.committedData.adlTags || []).map((t: any) => (
                          <span
                            key={t.id}
                            style={{
                              background: "#f8fafc",
                              color: "var(--text-main)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTES.blue[(t.level || 1) - 1] }} />
                            {t.text}
                          </span>
                        ))
                      : "—"}
                  </div>
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
              <InfoField
                label="Thị giác"
                value={
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(functionalModal.committedData.visionTags || []).length > 0
                      ? (functionalModal.committedData.visionTags || []).map((t: any) => (
                          <span
                            key={t.id}
                            style={{
                              background: "#f8fafc",
                              color: "var(--text-main)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTES.purple[(t.level || 1) - 1] }} />
                            {t.text}
                          </span>
                        ))
                      : "—"}
                  </div>
                }
              />
              <InfoField
                label="Thính giác"
                value={
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(functionalModal.committedData.hearingTags || []).length > 0
                      ? (functionalModal.committedData.hearingTags || []).map((t: any) => (
                          <span
                            key={t.id}
                            style={{
                              background: "#f8fafc",
                              color: "var(--text-main)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTES.purple[(t.level || 1) - 1] }} />
                            {t.text}
                          </span>
                        ))
                      : "—"}
                  </div>
                }
              />
            </div>
          </div>
        </BaseCard>
      </div>

      {/* 2. Bảng Cảnh báo Y tế */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", alignItems: "stretch" }}>
        {/* Dị ứng */}
        <BaseCard
          style={{
            backgroundColor: "#fff1f2",
            borderColor: allergiesModal.isOpen ? "var(--primary)" : "#fecdd3",
            height: "100%",
          }}
          isSelected={allergiesModal.isOpen}
          onClick={allergiesModal.openModal}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#be123c",
              fontSize: "1rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={18} /> Dị ứng nghiêm trọng
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {allergiesModal.committedData.allergies.trim() ? (
              allergiesModal.committedData.allergies.split(",").map((allergy, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#ffe4e6",
                    color: "#9f1239",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {allergy.trim()}
                </span>
              ))
            ) : (
              <span style={{ color: "#f43f5e", fontStyle: "italic", fontSize: "0.9rem" }}>Không có tiền sử dị ứng</span>
            )}
          </div>
        </BaseCard>

        {/* Bệnh nền */}
        <BaseCard
          style={{
            backgroundColor: "#fff7ed",
            borderColor: diseasesModal.isOpen ? "var(--primary)" : "#fed7aa",
            height: "100%",
          }}
          isSelected={diseasesModal.isOpen}
          onClick={diseasesModal.openModal}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#c2410c",
              fontSize: "1rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Activity size={18} /> Bệnh nền mãn tính
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {diseasesModal.committedData.chronicDiseases.trim() ? (
              diseasesModal.committedData.chronicDiseases.split(",").map((disease, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#ffedd5",
                    color: "#9a3412",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {disease.trim()}
                </span>
              ))
            ) : (
              <span style={{ color: "#fb923c", fontStyle: "italic", fontSize: "0.9rem" }}>Không có bệnh nền</span>
            )}
          </div>
        </BaseCard>

        {/* Đơn thuốc & Thiết bị */}
        <BaseCard
          style={{
            backgroundColor: "#f0fdf4",
            borderColor: treatmentModal.isOpen ? "var(--primary)" : "#bbf7d0",
            height: "100%",
          }}
          isSelected={treatmentModal.isOpen}
          onClick={treatmentModal.openModal}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#15803d",
              fontSize: "1rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Pill size={18} /> Đơn thuốc & Thiết bị Y tế
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Đơn thuốc */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Đơn thuốc thường xuyên</div>
              {treatmentModal.committedData.prescriptions.length > 0 ? (
                treatmentModal.committedData.prescriptions.map((p: any) => (
                  <div key={p.id} style={{ display: "flex", flexDirection: "column", background: "#fff", padding: "0.5rem", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "0.95rem", color: "#166534", fontWeight: 700 }}>{p.name}</span>
                      <span style={{ fontSize: "0.8rem", background: "#dcfce3", padding: "2px 6px", borderRadius: "4px", color: "#15803d", fontWeight: 600 }}>{p.time}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#15803d", marginTop: "2px" }}>Liều: {p.dosage} {p.unit} - {p.type}</div>
                    {p.notes && <div style={{ fontSize: "0.8rem", color: "#166534", fontStyle: "italic", marginTop: "4px" }}>* {p.notes}</div>}
                  </div>
                ))
              ) : (
                <span style={{ color: "#166534", fontStyle: "italic", fontSize: "0.9rem" }}>Không có đơn thuốc</span>
              )}
            </div>

            {/* Thiết bị */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px dashed #bbf7d0", paddingTop: "0.75rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Thiết bị Y tế / Hỗ trợ</div>
              {treatmentModal.committedData.medicalDevices.length > 0 ? (
                treatmentModal.committedData.medicalDevices.map((d: any) => (
                  <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "0.5rem", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
                    <span style={{ fontSize: "0.9rem", color: "#166534", fontWeight: 600 }}>{d.name}</span>
                    {d.serialNumber && <span style={{ fontSize: "0.75rem", color: "#15803d", fontFamily: "monospace" }}>SN: {d.serialNumber}</span>}
                  </div>
                ))
              ) : (
                <span style={{ color: "#166534", fontStyle: "italic", fontSize: "0.9rem" }}>Không dùng thiết bị hỗ trợ</span>
              )}
            </div>

          </div>
        </BaseCard>
      </div>

      {/* 3. Dòng thời gian y tế */}
      <BaseCard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1rem",
          }}
        >
          <Stethoscope size={20} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-main)", fontWeight: 700 }}>
            Lịch sử Khám & Điều trị
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingLeft: "1rem" }}>
          {medicalEvents.map((event, index) => (
            <div key={event.id} style={{ display: "flex", gap: "1.5rem", position: "relative" }}>
              {/* Timeline Line */}
              {index !== medicalEvents.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "19px",
                    top: "40px",
                    bottom: "-24px",
                    width: "2px",
                    background: "#e2e8f0",
                  }}
                />
              )}

              {/* Timeline Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: event.type === "emergency" ? "#fee2e2" : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  flexShrink: 0,
                  color: event.type === "emergency" ? "#ef4444" : "var(--primary)",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 0 1px #e2e8f0",
                }}
              >
                <Stethoscope size={18} />
              </div>

              {/* Event Content */}
              <div
                style={{
                  flex: 1,
                  background: "#f8fafc",
                  padding: "1rem 1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1rem" }}>{event.title}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>{event.date}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 500, marginBottom: "0.5rem" }}>
                  Thực hiện bởi: {event.doctor}
                </div>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569", lineHeight: 1.5 }}>{event.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* --- MODALS --- */}
      <BaseModal
        isOpen={metricsModal.isOpen}
        onClose={metricsModal.closeModal}
        title="Chỉnh sửa Chỉ số cơ thể"
        confirmText="Lưu thay đổi"
        onConfirm={metricsModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <BaseSelect
            label="Nhóm máu"
            value={metricsModal.localData.bloodType}
            onChange={(e) => {
              metricsModal.setLocalData({ ...metricsModal.localData, bloodType: e.target.value });
              metricsModal.markDirty();
            }}
            options={[
              { value: "", label: "Chưa cập nhật" },
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
            ]}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <BaseInput
              label="Chiều cao (cm)"
              value={metricsModal.localData.height}
              onChange={(e) => {
                metricsModal.setLocalData({ ...metricsModal.localData, height: e.target.value });
                metricsModal.markDirty();
              }}
            />
            <BaseInput
              label="Cân nặng (kg)"
              value={metricsModal.localData.weight}
              onChange={(e) => {
                metricsModal.setLocalData({ ...metricsModal.localData, weight: e.target.value });
                metricsModal.markDirty();
              }}
            />

          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={functionalModal.isOpen}
        onClose={functionalModal.closeModal}
        title="Chỉnh sửa Trạng thái Chức năng"
        confirmText="Lưu thay đổi"
        onConfirm={functionalModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ position: "relative", zIndex: 50 }}>
            <SeveritySelect
              title="Khả năng vận động"
              palette="blue"
              selected={functionalModal.localData.mobilityTags}
              onChange={(newTags) => {
                functionalModal.setLocalData({ ...functionalModal.localData, mobilityTags: newTags });
                functionalModal.markDirty();
              }}
              options={mobilityOptions}
              onOptionsChange={setMobilityOptions}
            />
          </div>
          <div style={{ position: "relative", zIndex: 40 }}>
            <SeveritySelect
              title="Trạng thái nhận thức"
              palette="purple"
              selected={functionalModal.localData.cognitiveTags}
              onChange={(newTags) => {
                functionalModal.setLocalData({ ...functionalModal.localData, cognitiveTags: newTags });
                functionalModal.markDirty();
              }}
              options={cognitiveOptions}
              onOptionsChange={setCognitiveOptions}
            />
          </div>
          
          <div style={{ borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />
          
          <div style={{ position: "relative", zIndex: 30 }}>
            <SeveritySelect
              title="Khả năng tự phục vụ (ADL)"
              palette="blue"
              selected={functionalModal.localData.adlTags || []}
              onChange={(tags) => {
                functionalModal.setLocalData({ ...functionalModal.localData, adlTags: tags });
                functionalModal.markDirty();
              }}
              options={adlOptions}
              onOptionsChange={setAdlOptions}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative", zIndex: 20 }}>
              <SeveritySelect
                title="Thị giác"
                palette="purple"
                selected={functionalModal.localData.visionTags || []}
                onChange={(tags) => {
                  functionalModal.setLocalData({ ...functionalModal.localData, visionTags: tags });
                  functionalModal.markDirty();
                }}
                options={visionOptions}
                onOptionsChange={setVisionOptions}
              />
            </div>
            <div style={{ position: "relative", zIndex: 10 }}>
              <SeveritySelect
                title="Thính giác"
                palette="purple"
                selected={functionalModal.localData.hearingTags || []}
                onChange={(tags) => {
                  functionalModal.setLocalData({ ...functionalModal.localData, hearingTags: tags });
                  functionalModal.markDirty();
                }}
                options={hearingOptions}
                onOptionsChange={setHearingOptions}
              />
            </div>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={allergiesModal.isOpen}
        onClose={allergiesModal.closeModal}
        title="Chỉnh sửa Dị ứng"
        confirmText="Lưu thay đổi"
        onConfirm={allergiesModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
              Dị ứng nghiêm trọng (cách nhau bởi dấu phẩy)
            </label>
            <textarea
              value={allergiesModal.localData.allergies}
              onChange={(e) => {
                allergiesModal.setLocalData({ ...allergiesModal.localData, allergies: e.target.value });
                allergiesModal.markDirty();
              }}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "#ffffff",
                fontSize: "0.95rem",
                minHeight: "100px",
                fontFamily: "inherit",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={diseasesModal.isOpen}
        onClose={diseasesModal.closeModal}
        title="Chỉnh sửa Bệnh nền"
        confirmText="Lưu thay đổi"
        onConfirm={diseasesModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
              Bệnh nền mãn tính (cách nhau bởi dấu phẩy)
            </label>
            <textarea
              value={diseasesModal.localData.chronicDiseases}
              onChange={(e) => {
                diseasesModal.setLocalData({ ...diseasesModal.localData, chronicDiseases: e.target.value });
                diseasesModal.markDirty();
              }}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "#ffffff",
                fontSize: "0.95rem",
                minHeight: "100px",
                fontFamily: "inherit",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={treatmentModal.isOpen}
        onClose={treatmentModal.closeModal}
        title="Chỉnh sửa Đơn thuốc & Thiết bị"
        confirmText="Lưu thay đổi"
        onConfirm={treatmentModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>Danh sách Đơn thuốc</label>
            <button
              onClick={() => {
                const newArr = [...treatmentModal.localData.prescriptions, { id: Math.random().toString(), name: "", type: "", dosage: "", unit: "", time: "", notes: "" }];
                treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                treatmentModal.markDirty();
              }}
              style={{ background: "#eef2ff", color: "var(--primary)", border: "none", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
            >
              + Thêm thuốc
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {treatmentModal.localData.prescriptions.map((p: any, index: number) => (
              <div key={p.id} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", position: "relative" }}>
                <button
                  onClick={() => {
                    const newArr = treatmentModal.localData.prescriptions.filter((_: any, i: number) => i !== index);
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                >
                  <Trash2 size={14} />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <BaseInput label="Tên thuốc" value={p.name} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.prescriptions];
                    newArr[index].name = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }} />
                  <BaseInput label="Loại (Huyết áp...)" value={p.type} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.prescriptions];
                    newArr[index].type = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <BaseInput label="Liều lượng" value={p.dosage} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.prescriptions];
                    newArr[index].dosage = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }} />
                  <BaseInput label="Đơn vị (mg/ml)" value={p.unit} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.prescriptions];
                    newArr[index].unit = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }} />
                  <BaseInput label="Thời gian uống" value={p.time} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.prescriptions];
                    newArr[index].time = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                    treatmentModal.markDirty();
                  }} />
                </div>
                <BaseInput label="Ghi chú thêm" value={p.notes} onChange={(e) => {
                  const newArr = [...treatmentModal.localData.prescriptions];
                  newArr[index].notes = e.target.value;
                  treatmentModal.setLocalData({ ...treatmentModal.localData, prescriptions: newArr });
                  treatmentModal.markDirty();
                }} />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px dashed var(--border)", margin: "0.5rem 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>Thiết bị Y tế / Hỗ trợ</label>
            <button
              onClick={() => {
                const newArr = [...treatmentModal.localData.medicalDevices, { id: Math.random().toString(), name: "", serialNumber: "" }];
                treatmentModal.setLocalData({ ...treatmentModal.localData, medicalDevices: newArr });
                treatmentModal.markDirty();
              }}
              style={{ background: "#eef2ff", color: "var(--primary)", border: "none", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
            >
              + Thêm thiết bị
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {treatmentModal.localData.medicalDevices.map((d: any, index: number) => (
              <div key={d.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                <div style={{ flex: 2 }}>
                  <BaseInput label="Tên thiết bị (VD: Răng giả)" value={d.name} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.medicalDevices];
                    newArr[index].name = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, medicalDevices: newArr });
                    treatmentModal.markDirty();
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <BaseInput label="Serial Number" value={d.serialNumber} onChange={(e) => {
                    const newArr = [...treatmentModal.localData.medicalDevices];
                    newArr[index].serialNumber = e.target.value;
                    treatmentModal.setLocalData({ ...treatmentModal.localData, medicalDevices: newArr });
                    treatmentModal.markDirty();
                  }} />
                </div>
                <button
                  onClick={() => {
                    const newArr = treatmentModal.localData.medicalDevices.filter((_: any, i: number) => i !== index);
                    treatmentModal.setLocalData({ ...treatmentModal.localData, medicalDevices: newArr });
                    treatmentModal.markDirty();
                  }}
                  style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#ef4444", cursor: "pointer", padding: "0.5rem", borderRadius: "8px", height: "38px" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </BaseModal>
    </div>
  );
};
