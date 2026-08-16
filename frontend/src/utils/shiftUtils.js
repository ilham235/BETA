export const normalizeShiftValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return "-";
  }

  const normalizedValue = rawValue.toLowerCase();
  const shiftNameMap = {
    "1": "Pagi",
    "2": "Siang",
    "3": "Sore",
    "pagi": "Pagi",
    "siang": "Siang",
    "sore": "Sore",
    "shift pagi": "Pagi",
    "shift siang": "Siang",
    "shift sore": "Sore"
  };

  return shiftNameMap[normalizedValue] || rawValue;
};
