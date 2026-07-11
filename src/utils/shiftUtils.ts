/**
 * Tính số phút của một ca trực dựa vào giờ bắt đầu và kết thúc
 * @param startTime "HH:mm"
 * @param endTime "HH:mm"
 * @returns number (số phút)
 */
export const getShiftDurationMinutes = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let startTotalMins = startHour * 60 + startMin;
  let endTotalMins = endHour * 60 + endMin;
  
  // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu, ca làm việc kéo dài qua đêm sang ngày hôm sau
  if (endTotalMins < startTotalMins) {
    endTotalMins += 24 * 60;
  }
  
  return endTotalMins - startTotalMins;
};

/**
 * Phân biệt ca chính (>= 8 tiếng) và ca phụ (< 8 tiếng)
 */
export const isMainShift = (startTime: string, endTime: string): boolean => {
  const duration = getShiftDurationMinutes(startTime, endTime);
  return duration >= 8 * 60; // 8 tiếng
};

/**
 * Phân biệt ca đêm và ca ngày
 * Ca đêm là ca qua đêm (start > end) hoặc bắt đầu sau 22h, trước 4h
 */
export const isNightShift = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  // Kéo dài qua 0h
  if (endHour < startHour) return true;
  
  // Bắt đầu vào khoảng đêm (22h đến 4h sáng hôm sau)
  if (startHour >= 22 || startHour < 4) return true;
  
  return false;
};
