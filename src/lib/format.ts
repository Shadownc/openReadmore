export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

export function shortText(value: string | null | undefined, length = 48) {
  if (!value) return "-";
  return value.length > length ? `${value.slice(0, length)}...` : value;
}
