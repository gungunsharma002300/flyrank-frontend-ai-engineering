import fs from "node:fs";

const required = [
  "app/api/chat/route.ts",
  "app/api/chat-free/route.ts",
  "app/page.tsx",
  "package.json",
];

let ok = true;
for (const file of required) {
  const exists = fs.existsSync(file);
  console.log(`${exists ? "OK" : "MISSING"}  ${file}`);
  if (!exists) ok = false;
}
process.exit(ok ? 0 : 1);
