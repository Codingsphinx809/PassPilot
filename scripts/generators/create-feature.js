const fs = require("fs");
const path = require("path");

const feature = process.argv[2];

if (!feature) {
  console.log("Usage:");
  console.log("npm run make:feature <feature-name>");
  process.exit(1);
}

const root = path.join(process.cwd(), "features", feature);

const folders = [
  "",
  "components",
  "hooks",
  "repositories",
  "screens",
  "services",
  "types",
  "utils",
];

for (const folder of folders) {
  const folderPath = path.join(root, folder);

  fs.mkdirSync(folderPath, {
    recursive: true,
  });

  fs.writeFileSync(
    path.join(folderPath, "index.ts"),
    ""
  );
}

console.log(`✅ Feature '${feature}' created.`);