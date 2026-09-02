import { execFileSync } from "node:child_process";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const outputDir = "release";
const archiveName = `tetorica-drawing-measure-${packageJson.version}-itch.zip`;

fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(`${outputDir}/${archiveName}`, { force: true });
execFileSync("zip", ["-r", `../${outputDir}/${archiveName}`, ".", "-x", "*.DS_Store"], {
  cwd: "dist",
  stdio: "inherit",
});

console.log(`created ${outputDir}/${archiveName}`);
