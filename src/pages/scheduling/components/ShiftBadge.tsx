import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Check, X, Clock, CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";
import { getShiftColor } from "../../../utils/scheduleUtils";
import type { ShiftEntry } from "../types";
import styles from "../Schedule.module.scss";
import { useLeaveSwap } from "../../../contexts/LeaveSwapContext";

interface ShiftBadgeProps extends ShiftEntry {
  compact?: boolean;
}

export const ShiftBadge: React.FC<ShiftBadgeProps> = ({ shift, type, note, reqId, status, compact = false }) => {
  const color = getShiftColor(type);
  const label = compact ? shift.charAt(0).toUpperCase() : shift;
  const isLeave = type.startsWith("leave");
  const isSwap = type.startsWith("swap");

  const { approveLeave, rejectLeave, approveSwap, rejectSwap } = useLeaveSwap();

  const [showPopover, setShowPopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const isPending = status === "pending";
  const isActionable = isPending && reqId;

  const handleMouseEnter = () => {
    if (!note && !isActionable) return;
    
    timeoutRef.current = window.setTimeout(() => {
      if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        setPopoverPos({ x: rect.left, y: rect.bottom + 8 });
        setShowPopover(true);
      }
    }, 300); // 300ms delay
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setShowPopover(false);
    }, 200);
  };

  const handlePopoverEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setShowPopover(true);
  };

  const handlePopoverLeave = () => {
    setShowPopover(false);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type.includes("leave")) approveLeave(reqId!);
    if (type.includes("swap")) approveSwap(reqId!);
    setShowPopover(false);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = window.prompt("Nhập lý do từ chối (bắt buộc):");
    if (reason) {
      if (type.includes("leave")) rejectLeave(reqId!, reason);
      if (type.includes("swap")) rejectSwap(reqId!, reason);
      setShowPopover(false);
    }
  };

  const renderStatusBadge = () => {
    if (!status) return null;
    const badgeStyle: React.CSSProperties = {
      position: "absolute",
      top: compact ? -4 : -6,
      right: compact ? -4 : -6,
      width: compact ? 12 : 16,
      height: compact ? 12 : 16,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      zIndex: 2
    };
    if (status === "pending") return <div style={badgeStyle}><Clock size={compact ? 10 : 12} color="#ca8a04" /></div>;
    if (status === "approved") return <div style={badgeStyle}><CheckCircle2 size={compact ? 10 : 12} color="#16a34a" /></div>;
    if (status === "rejected") return <div style={badgeStyle}><XCircle size={compact ? 10 : 12} color="#dc2626" /></div>;
    return null;
  };

  return (
    <>
      <div
        ref={badgeRef}
        className={styles.shiftBadge}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: isLeave 
            ? `repeating-linear-gradient(45deg, ${color.bg}, ${color.bg} 8px, #ffffff 8px, #ffffff 16px)` 
            : color.bg,
          color: type === "leave-rejected" || type === "swap-rejected" ? "#94a3b8" : color.color,
          textDecoration: type === "leave-rejected" || type === "swap-rejected" ? "line-through" : "none",
          borderColor: color.border,
          padding: compact ? "4px 0" : "0.5rem",
          fontSize: compact ? "0.75rem" : "0.85rem",
          minHeight: compact ? "24px" : "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: isActionable ? "pointer" : "default"
        }}
      >
        {isSwap ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            {!compact && <ArrowRightLeft size={14} />}
            {label}
          </div>
        ) : (
          label
        )}
        
        {renderStatusBadge()}

        {type === "warning" && (
          <AlertTriangle
            size={compact ? 10 : 14}
            color="#b91c1c"
            style={{ position: "absolute", top: compact ? 2 : 4, right: compact ? 2 : 4 }}
          />
        )}
      </div>

      {showPopover && createPortal(
        <div
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handlePopoverLeave}
          style={{
            position: "fixed",
            left: Math.min(popoverPos.x, window.innerWidth - 220),
            top: popoverPos.y,
            backgroundColor: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "12px",
            zIndex: 9999,
            width: "220px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            cursor: "default"
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            <strong style={{ color: "var(--primary)", display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isSwap ? <><ArrowRightLeft size={14}/> Xin đổi ca</> : "Xin nghỉ phép"}
            </strong>
            <br />
            {note || "Không có lý do"}
          </div>
          
          {isActionable && (
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                onClick={handleApprove}
                style={{ flex: 1, padding: "6px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <Check size={12} /> Duyệt
              </button>
              <button
                onClick={handleReject}
                style={{ flex: 1, padding: "6px", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <X size={12} /> Từ chối
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export const EmptyShiftBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    className={styles.shiftBadge}
    style={{
      border: "1px dashed var(--border)",
      color: "var(--text-muted)",
      padding: compact ? "4px 0" : undefined,
      fontSize: compact ? "0.75rem" : undefined,
      minHeight: compact ? "24px" : "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {compact ? "-" : "OFF"}
  </div>
);
