import React, { useMemo } from "react";
import { startOfMonth, addDays, format, isSameDay, differenceInDays, isBefore, isAfter, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { User, PenTool, Building2 } from "lucide-react";
import type { Slot, Room, Bed, Floor, Building } from "../../../../mock/facility";

interface Props {
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  beds: Bed[];
  slots: Slot[];
}

interface FlatRow {
  slot: Slot;
  bed: Bed;
  room: Room;
  floor: Floor;
  building: Building;
  spans: {
    building: number;
    floor: number;
    room: number;
    bed: number;
  };
}

export const TimelinePanel: React.FC<Props> = ({ buildings, floors, rooms, beds, slots }) => {
  const colWidth = 50; // pixel
  const totalDays = 40;
  
  // 1. Generate 40-day timeline starting from start of current month
  const timelineDays = useMemo(() => {
    const start = startOfMonth(new Date());
    return Array.from({ length: totalDays }, (_, i) => addDays(start, i));
  }, []);

  const timelineStart = timelineDays[0];
  const timelineEnd = timelineDays[timelineDays.length - 1];

  // 2. Prepare tabular data with rowspans
  const tableRows = useMemo(() => {
    // 2.1 First, create all flat rows
    const allRows: FlatRow[] = [];
    
    // Sort logic requires hierarchy order
    buildings.forEach(building => {
      const bFloors = floors.filter(f => f.buildingId === building.id);
      bFloors.forEach(floor => {
        const fRooms = rooms.filter(r => r.floorId === floor.id);
        fRooms.forEach(room => {
          const rBeds = beds.filter(b => b.roomId === room.id);
          rBeds.forEach(bed => {
            const bSlots = slots.filter(s => s.bedId === bed.id);
            bSlots.forEach(slot => {
              allRows.push({
                building, floor, room, bed, slot,
                spans: { building: 1, floor: 1, room: 1, bed: 1 } // initial
              });
            });
          });
        });
      });
    });

    // 2.2 Calculate rowSpans
    let bStart = 0;
    let fStart = 0;
    let rStart = 0;
    let bedStart = 0;

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i];

      // Reset spans to 0 by default for everything except index 0s
      if (i > 0) {
        row.spans.building = 0;
        row.spans.floor = 0;
        row.spans.room = 0;
        row.spans.bed = 0;
      }

      // Check Building boundary
      if (i > 0 && row.building.id !== allRows[i - 1].building.id) {
        allRows[bStart].spans.building = i - bStart;
        bStart = i;
        row.spans.building = 1;
      }
      
      // Check Floor boundary
      if (i > 0 && row.floor.id !== allRows[i - 1].floor.id) {
        allRows[fStart].spans.floor = i - fStart;
        fStart = i;
        row.spans.floor = 1;
      }

      // Check Room boundary
      if (i > 0 && row.room.id !== allRows[i - 1].room.id) {
        allRows[rStart].spans.room = i - rStart;
        rStart = i;
        row.spans.room = 1;
      }

      // Check Bed boundary
      if (i > 0 && row.bed.id !== allRows[i - 1].bed.id) {
        allRows[bedStart].spans.bed = i - bedStart;
        bedStart = i;
        row.spans.bed = 1;
      }
    }

    // Process last segments
    if (allRows.length > 0) {
      allRows[bStart].spans.building = allRows.length - bStart;
      allRows[fStart].spans.floor = allRows.length - fStart;
      allRows[rStart].spans.room = allRows.length - rStart;
      allRows[bedStart].spans.bed = allRows.length - bedStart;
    }

    return allRows;
  }, [buildings, floors, rooms, beds, slots]);

  const renderBlock = (slot: Slot) => {
    if (!slot.startDate || slot.status === "available") return null;
    
    const slotStart = parseISO(slot.startDate);
    const slotEnd = slot.endDate ? parseISO(slot.endDate) : addDays(timelineEnd, 10); // cap beyond timeline

    if (isAfter(slotStart, timelineEnd) || isBefore(slotEnd, timelineStart)) return null;

    let actualStart = isBefore(slotStart, timelineStart) ? timelineStart : slotStart;
    let actualEnd = isAfter(slotEnd, timelineEnd) ? timelineEnd : slotEnd;

    const startIdx = differenceInDays(actualStart, timelineStart);
    const duration = differenceInDays(actualEnd, actualStart) + 1;

    const left = startIdx * colWidth;
    const width = duration * colWidth;

    const isMaintenance = slot.status === "maintenance";
    const bg = isMaintenance ? "repeating-linear-gradient(45deg, #fef2f2, #fef2f2 10px, #fee2e2 10px, #fee2e2 20px)" : "linear-gradient(135deg, var(--primary), var(--primary-dark, #4338ca))";
    const color = isMaintenance ? "#ef4444" : "#fff";

    return (
      <div style={{
        position: "absolute",
        left: left + 2,
        width: width - 4,
        top: 6,
        bottom: 6,
        background: bg,
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: color,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        zIndex: 10,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s"
      }} 
      title={`${slot.occupantName || "Bảo trì"}\nTừ: ${format(slotStart, 'dd/MM/yyyy')}\nĐến: ${!slot.endDate ? "Chưa xác định" : format(slotEnd, 'dd/MM/yyyy')}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      }}
      >
        {isMaintenance ? (
          <><PenTool size={12} style={{ marginRight: 6 }} /> Bảo trì</>
        ) : (
          <><User size={12} style={{ marginRight: 6, opacity: 0.9 }} /> {slot.occupantName}</>
        )}
      </div>
    );
  };

  const stickyStyle: React.CSSProperties = {
    position: "sticky",
    background: "#fff",
    borderRight: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    padding: "0.5rem 1rem",
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "var(--text-main)",
    zIndex: 20
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "max-content", minWidth: "100%" }}>
          <thead>
            <tr>
              {/* 5 Fixed Columns Header */}
              <th style={{ ...stickyStyle, left: 0, top: 0, zIndex: 30 }}>Tòa nhà</th>
              <th style={{ ...stickyStyle, left: 120, top: 0, zIndex: 30 }}>Tầng</th>
              <th style={{ ...stickyStyle, left: 220, top: 0, zIndex: 30 }}>Phòng</th>
              <th style={{ ...stickyStyle, left: 320, top: 0, zIndex: 30 }}>Giường</th>
              <th style={{ ...stickyStyle, left: 420, top: 0, zIndex: 30 }}>Vị trí (Slot)</th>
              
              {/* Timeline Grid Header */}
              {timelineDays.map((date, idx) => {
                const isToday = isSameDay(date, new Date());
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <th key={idx} style={{
                    width: colWidth, minWidth: colWidth, maxWidth: colWidth,
                    position: "sticky", top: 0, zIndex: 10,
                    background: isToday ? "var(--primary-light, #eef2ff)" : isWeekend ? "#f8fafc" : "#fff",
                    borderRight: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    padding: "0.5rem 0",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      {format(date, "EE", { locale: vi })}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: isToday ? 800 : 600, color: isToday ? "var(--primary)" : "var(--text-main)" }}>
                      {format(date, "dd")}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => {
              return (
                <tr key={idx}>
                  {/* Left Fixed Columns */}
                  {row.spans.building > 0 && (
                    <td rowSpan={row.spans.building} style={{ ...stickyStyle, left: 0, width: 120, verticalAlign: "top" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Building2 size={14} color="var(--primary)" /> {row.building.name}
                      </div>
                    </td>
                  )}
                  {row.spans.floor > 0 && (
                    <td rowSpan={row.spans.floor} style={{ ...stickyStyle, left: 120, width: 100, verticalAlign: "top" }}>
                      {row.floor.name}
                    </td>
                  )}
                  {row.spans.room > 0 && (
                    <td rowSpan={row.spans.room} style={{ ...stickyStyle, left: 220, width: 100, verticalAlign: "top" }}>
                      {row.room.name}
                    </td>
                  )}
                  {row.spans.bed > 0 && (
                    <td rowSpan={row.spans.bed} style={{ ...stickyStyle, left: 320, width: 100, verticalAlign: "top" }}>
                      {row.bed.name}
                    </td>
                  )}
                  <td style={{ ...stickyStyle, left: 420, width: 150, color: "var(--text-muted)", fontWeight: 500 }}>
                    {row.slot.name}
                  </td>

                  {/* Right Timeline Grid */}
                  <td colSpan={totalDays} style={{ 
                    position: "relative", height: 40, padding: 0,
                    borderBottom: "1px solid var(--border)",
                    background: "url('data:image/svg+xml;utf8,<svg width=\"50\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M49.5 0v40M0 39.5h50\" stroke=\"%23f1f5f9\" fill=\"none\"/></svg>') left top"
                  }}>
                    {/* Today Indicator Line */}
                    {timelineDays.findIndex(d => isSameDay(d, new Date())) !== -1 && (
                      <div style={{
                        position: "absolute",
                        left: timelineDays.findIndex(d => isSameDay(d, new Date())) * colWidth + (colWidth / 2),
                        top: 0, bottom: 0, width: 2, background: "var(--danger, #ef4444)", zIndex: 5, pointerEvents: "none"
                      }} />
                    )}

                    {renderBlock(row.slot)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
