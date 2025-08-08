const fs = require("fs");
const path = require("path");

function logDirectoryTree(dir, indent = "") {
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const fullPath = path.join(dir, file);

    // Skip node_modules directory
    if (file === "node_modules" || file === ".next" || file === ".git") return;

    const stats = fs.statSync(fullPath);
    const isLast = index === files.length - 1;

    console.log(`${indent}${isLast ? "└──" : "├──"} ${file}`);

    if (stats.isDirectory()) {
      logDirectoryTree(fullPath, `${indent}${isLast ? "    " : "│   "}`);
    }
  });
}

const rootDir = path.join(__dirname); // Project root (or specify a path)
logDirectoryTree(rootDir);
