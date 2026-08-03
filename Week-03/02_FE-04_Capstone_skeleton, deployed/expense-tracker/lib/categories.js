export const CATEGORIES = [
  { name: "Food", emoji: "🍔", color: "#C65D45" },
  { name: "Transport", emoji: "🚗", color: "#3A6EA5" },
  { name: "Shopping", emoji: "🛍️", color: "#8859A3" },
  { name: "Bills", emoji: "🧾", color: "#C9A227" },
  { name: "Entertainment", emoji: "🎬", color: "#2F9E8F" },
  { name: "Health", emoji: "💊", color: "#4A7C59" },
  { name: "Other", emoji: "✨", color: "#6B6B6B" },
];

export function getCategory(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
}
