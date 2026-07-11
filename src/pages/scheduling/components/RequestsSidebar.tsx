import React, { useState } from "react";
import { Check, X, Bell, Search } from "lucide-react";
import { useLeaveSwap } from "../../../contexts/LeaveSwapContext";

interface RequestsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestsSidebar: React.FC<RequestsSidebarProps> = ({ isOpen, onClose }) => {
  const { leaveRequests, swapRequests, approveLeave, rejectLeave, approveSwap, rejectSwap } = useLeaveSwap();

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [subTab, setSubTab] = useState<"all" | "leave" | "swap">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingLeaves = leaveRequests.filter((r) => r.status === "pending");
  const pendingSwaps = swapRequests.filter((r) => r.status === "pending");
  const historyLeaves = leaveRequests.filter((r) => r.status !== "pending");
  const historySwaps = swapRequests.filter((r) => r.status !== "pending");

  // Filtering Logic
  const filterList = (list: any[], type: "leave" | "swap") => {
    return list.filter((item) => {
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      if (type === "leave") return item.staffName?.toLowerCase().includes(q) || item.reason?.toLowerCase().includes(q);
      if (type === "swap") return item.requesterName?.toLowerCase().includes(q) || item.targetStaffName?.toLowerCase().includes(q) || item.reason?.toLowerCase().includes(q);
      return true;
    });
  };

  const filteredPendingLeaves = filterList(pendingLeaves, "leave");
  const filteredPendingSwaps = filterList(pendingSwaps, "swap");
  const filteredHistoryLeaves = filterList(historyLeaves, "leave");
  const filteredHistorySwaps = filterList(historySwaps, "swap");

  if (!isOpen) return null;

  const handleRejectLeave = (id: string) => {
    const reason = window.prompt("Nhập lý do từ chối (bắt buộc):");
    if (reason) rejectLeave(id, reason);
  };

  const handleRejectSwap = (id: string) => {
    const reason = window.prompt("Nhập lý do từ chối (bắt buộc):");
    if (reason) rejectSwap(id, reason);
  };

  const approveAllLeaves = () => filteredPendingLeaves.forEach((r) => approveLeave(r.id));
  const approveAllSwaps = () => filteredPendingSwaps.forEach((r) => approveSwap(r.id));

  const rejectAllLeaves = () => {
    const reason = window.prompt("Nhập lý do từ chối hàng loạt (bắt buộc):");
    if (reason) filteredPendingLeaves.forEach((r) => rejectLeave(r.id, reason));
  };

  const rejectAllSwaps = () => {
    const reason = window.prompt("Nhập lý do từ chối hàng loạt (bắt buộc):");
    if (reason) filteredPendingSwaps.forEach((r) => rejectSwap(r.id, reason));
  };

  const renderLeaveCard = (req: any, isHistory: boolean) => (
    <div key={req.id} style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "10px", backgroundColor: isHistory ? "#f8fafc" : "#fff", display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)" }}>{req.staffName}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{req.startDate} - {req.endDate}</div>
        </div>
        {isHistory ? (
          <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: req.status === "approved" ? "#dcfce7" : "#fee2e2", color: req.status === "approved" ? "#166534" : "#991b1b", fontWeight: 600 }}>
            {req.status === "approved" ? "Đã duyệt" : "Từ chối"}
          </span>
        ) : (
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => approveLeave(req.id)} style={{ padding: "4px 8px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <Check size={12} /> Duyệt
            </button>
            <button onClick={() => handleRejectLeave(req.id)} style={{ padding: "4px 8px", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <X size={12} /> Từ chối
            </button>
          </div>
        )}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#b45309", backgroundColor: "#fef3c7", padding: "4px 8px", borderRadius: "4px", alignSelf: "flex-start" }}>
        Lý do: {req.reason}
      </div>
      {isHistory && req.status === "rejected" && req.rejectReason && (
        <div style={{ fontSize: "0.75rem", color: "#991b1b", marginTop: "4px", fontWeight: 500 }}>
          Từ chối vì: {req.rejectReason}
        </div>
      )}
    </div>
  );

  const renderSwapCard = (req: any, isHistory: boolean) => (
    <div key={req.id} style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "10px", backgroundColor: isHistory ? "#f8fafc" : "#fff", display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)", backgroundColor: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>
          Ngày: {req.date}
        </div>
        {isHistory ? (
          <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: req.status === "approved" ? "#dcfce7" : "#fee2e2", color: req.status === "approved" ? "#166534" : "#991b1b", fontWeight: 600 }}>
            {req.status === "approved" ? "Đã duyệt" : "Từ chối"}
          </span>
        ) : (
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => approveSwap(req.id)} style={{ padding: "4px 8px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <Check size={12} /> Duyệt
            </button>
            <button onClick={() => handleRejectSwap(req.id)} style={{ padding: "4px 8px", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <X size={12} /> Từ chối
            </button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", margin: "4px 0" }}>
        <div style={{ flex: 1, backgroundColor: "#f1f5f9", padding: "6px", borderRadius: "4px" }}>
          <div style={{ fontWeight: 600 }}>{req.requesterName}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Ca {req.requesterShift}</div>
        </div>
        <div style={{ color: "var(--primary)", fontWeight: "bold" }}>⇄</div>
        <div style={{ flex: 1, backgroundColor: "#f1f5f9", padding: "6px", borderRadius: "4px", textAlign: "right" }}>
          <div style={{ fontWeight: 600 }}>{req.targetStaffName}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Ca {req.targetShift}</div>
        </div>
      </div>
      <div style={{ fontSize: "0.75rem", color: "#0369a1", backgroundColor: "#e0f2fe", padding: "4px 8px", borderRadius: "4px", alignSelf: "flex-start" }}>
        Lý do: {req.reason}
      </div>
      {isHistory && req.status === "rejected" && req.rejectReason && (
        <div style={{ fontSize: "0.75rem", color: "#991b1b", marginTop: "4px", fontWeight: 500 }}>
          Từ chối vì: {req.rejectReason}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        width: "450px",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "-4px 0 15px rgba(0,0,0,0.03)",
        zIndex: 10,
        position: "absolute",
        top: 0,
        right: 0,
        transition: "transform 0.3s ease",
      }}
    >
      {/* Header */}
      <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={18} color="var(--primary)" /> Quản lý Yêu cầu
        </h3>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
          <X size={20} color="var(--text-muted)" />
        </button>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", backgroundColor: "#fff" }}>
        <button
          onClick={() => setActiveTab("pending")}
          style={{ flex: 1, padding: "12px", border: "none", backgroundColor: activeTab === "pending" ? "#fff" : "#f8fafc", borderBottom: activeTab === "pending" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "pending" ? "var(--primary)" : "var(--text-muted)", fontWeight: activeTab === "pending" ? 600 : 500, cursor: "pointer", fontSize: "0.9rem" }}
        >
          Cần duyệt ({(pendingLeaves.length + pendingSwaps.length)})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{ flex: 1, padding: "12px", border: "none", backgroundColor: activeTab === "history" ? "#fff" : "#f8fafc", borderBottom: activeTab === "history" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "history" ? "var(--primary)" : "var(--text-muted)", fontWeight: activeTab === "history" ? 600 : 500, cursor: "pointer", fontSize: "0.9rem" }}
        >
          Lịch sử
        </button>
      </div>

      {/* Toolbar: SubTabs & Search */}
      <div style={{ padding: "1rem 1rem 0", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: "6px", padding: "6px 12px" }}>
          <Search size={14} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên nhân viên..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", marginLeft: "8px", flex: 1, fontSize: "0.85rem" }}
          />
          {searchQuery && <X size={14} color="var(--text-muted)" style={{ cursor: "pointer" }} onClick={() => setSearchQuery("")} />}
        </div>

        {/* SubTabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={() => setSubTab("all")} 
            style={{ padding: "6px 12px", borderRadius: "16px", border: subTab === "all" ? "1px solid var(--primary)" : "1px solid var(--border)", backgroundColor: subTab === "all" ? "#eef2ff" : "#fff", color: subTab === "all" ? "var(--primary)" : "var(--text-main)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer" }}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setSubTab("leave")} 
            style={{ padding: "6px 12px", borderRadius: "16px", border: subTab === "leave" ? "1px solid #be185d" : "1px solid var(--border)", backgroundColor: subTab === "leave" ? "#fce7f3" : "#fff", color: subTab === "leave" ? "#be185d" : "var(--text-main)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer" }}
          >
            Nghỉ phép ({activeTab === "pending" ? filteredPendingLeaves.length : filteredHistoryLeaves.length})
          </button>
          <button 
            onClick={() => setSubTab("swap")} 
            style={{ padding: "6px 12px", borderRadius: "16px", border: subTab === "swap" ? "1px solid #0369a1" : "1px solid var(--border)", backgroundColor: subTab === "swap" ? "#e0f2fe" : "#fff", color: subTab === "swap" ? "#0369a1" : "var(--text-main)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer" }}
          >
            Đổi ca ({activeTab === "pending" ? filteredPendingSwaps.length : filteredHistorySwaps.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {activeTab === "pending" && (
          <>
            {/* Leave Requests */}
            {(subTab === "all" || subTab === "leave") && (
              <div>
                <div style={{ margin: "0 0 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)" }}>Nghỉ phép</h4>
                  {filteredPendingLeaves.length > 0 && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={approveAllLeaves} style={{ fontSize: "0.7rem", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}>
                        Duyệt tất cả
                      </button>
                      <button onClick={rejectAllLeaves} style={{ fontSize: "0.7rem", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}>
                        Từ chối tất cả
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredPendingLeaves.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>Không có yêu cầu</div>
                  ) : (
                    filteredPendingLeaves.map(req => renderLeaveCard(req, false))
                  )}
                </div>
              </div>
            )}

            {/* Swap Requests */}
            {(subTab === "all" || subTab === "swap") && (
              <div>
                <div style={{ margin: "0 0 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)" }}>Đổi ca chéo</h4>
                  {filteredPendingSwaps.length > 0 && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={approveAllSwaps} style={{ fontSize: "0.7rem", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}>
                        Duyệt tất cả
                      </button>
                      <button onClick={rejectAllSwaps} style={{ fontSize: "0.7rem", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}>
                        Từ chối tất cả
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredPendingSwaps.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>Không có yêu cầu</div>
                  ) : (
                    filteredPendingSwaps.map(req => renderSwapCard(req, false))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            {/* History Leaves */}
            {(subTab === "all" || subTab === "leave") && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--text-main)" }}>Lịch sử Nghỉ phép</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredHistoryLeaves.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>Trống</div>
                  ) : (
                    filteredHistoryLeaves.map(req => renderLeaveCard(req, true))
                  )}
                </div>
              </div>
            )}

            {/* History Swaps */}
            {(subTab === "all" || subTab === "swap") && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--text-main)" }}>Lịch sử Đổi ca</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredHistorySwaps.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>Trống</div>
                  ) : (
                    filteredHistorySwaps.map(req => renderSwapCard(req, true))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
