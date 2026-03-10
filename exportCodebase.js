const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const projectName = path.basename(rootDir);
const outputFile = path.join(rootDir, "AI_CODEBASE.txt");

const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".css",
  ".html",
  ".md"
];

const ignoredFolders = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".vercel",
  ".vscode",
  ".idea"
];

const ignoredFiles = [
  ".env",
  ".env.local",
  "package-lock.json",
  "yarn.lock"
];

let stats = {
  files: 0,
  lines: 0
};

function shouldIgnore(file) {
  return ignoredFiles.includes(file);
}

/* =========================================================
   PROJECT STRUCTURE GENERATOR
========================================================= */

function generateTree(dir, prefix = "") {

  let tree = "";
  let files;

  try {
    files = fs.readdirSync(dir);
  } catch {
    return "";
  }

  files = files.filter(file => !ignoredFolders.includes(file));

  files.forEach((file, index) => {

    const fullPath = path.join(dir, file);

    let stat;

    try {
      stat = fs.statSync(fullPath);
    } catch {
      return;
    }

    const isLast = index === files.length - 1;
    const connector = isLast ? "└── " : "├── ";

    tree += `${prefix}${connector}${file}\n`;

    if (stat.isDirectory()) {

      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      tree += generateTree(fullPath, nextPrefix);

    }

  });

  return tree;
}

/* =========================================================
   CODE EXPORT
========================================================= */

function readDirectory(dir) {

  let result = "";

  let files;

  try {
    files = fs.readdirSync(dir);
  } catch {
    return "";
  }

  for (const file of files) {

    const fullPath = path.join(dir, file);

    let stat;

    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {

      if (ignoredFolders.includes(file)) continue;

      result += readDirectory(fullPath);
      continue;
    }

    if (shouldIgnore(file)) continue;

    const ext = path.extname(file);

    if (!allowedExtensions.includes(ext)) continue;

    let content;

    try {
      content = fs.readFileSync(fullPath, "utf8");
    } catch {
      continue;
    }

    stats.files++;
    stats.lines += content.split("\n").length;

    result += `

############################################################
FILE: ${path.relative(rootDir, fullPath)}
############################################################

${content}

`;
  }

  return result;
}

console.log("🔍 Scanning project...");

/* =========================================================
   BUILD STRUCTURE
========================================================= */

const treeStructure = `
============================================================
PROJECT STRUCTURE
============================================================

${projectName}
${generateTree(rootDir)}

============================================================

`;

/* =========================================================
   EXPORT CODEBASE
========================================================= */

const codebase = readDirectory(rootDir);

const header = `
============================================================
AI CODEBASE EXPORT
============================================================

Project Folder : ${rootDir}
Export Date    : ${new Date().toISOString()}

Total Files    : ${stats.files}
Total Lines    : ${stats.lines}

============================================================

`;

fs.writeFileSync(outputFile, header + treeStructure + codebase);

console.log("✅ Codebase exported successfully");
console.log("📄 File:", outputFile);
console.log("📦 Files:", stats.files);
console.log("📏 Lines:", stats.lines);