import { copyFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bridge = resolve(root, "nuvemshop-storefront");
const executable = process.platform === "win32" ? "npm.cmd" : "npm";

function run(args, cwd) {
  const result = spawnSync(executable, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run(["ci"], bridge);
run(["run", "build"], bridge);
run(["exec", "--", "expo", "export", "--platform", "web"], root);

const scriptDirectory = resolve(root, "dist", "nuvemshop");
mkdirSync(scriptDirectory, { recursive: true });
copyFileSync(
  resolve(bridge, "dist", "main.min.js"),
  resolve(scriptDirectory, "main.min.js"),
);
