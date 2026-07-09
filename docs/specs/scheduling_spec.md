# Đặc tả Schema: `scheduling`
**Mô tả:** Lịch làm việc của nhân viên và lịch thực tế của Người cao tuổi (NCT)

## Danh sách các bảng dự kiến (Tables)

### 1. `staff_shifts`
- Định nghĩa các ca làm việc của nhân viên (Ca sáng, Ca chiều, Ca đêm).

### 2. `staff_roster`
- Bảng phân ca làm việc chi tiết cho nhân viên theo ngày/tuần.

### 3. `resident_daily_schedules`
- Lịch sinh hoạt, chăm sóc chi tiết trong ngày của từng Người cao tuổi.

### 4. `task_assignments`
- Phân công nhiệm vụ chăm sóc cụ thể cho điều dưỡng (gắn với lịch của NCT).

> *Ghi chú: Cấu trúc chi tiết của từng bảng (Cột, Khóa chính, Khóa ngoại) sẽ được cập nhật dựa trên thiết kế CSDL thực tế.*
