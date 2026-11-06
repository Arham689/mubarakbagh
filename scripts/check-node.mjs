// Runs before `npm run dev` / `npm run build`.
// Tailwind CSS 4 needs Node >= 20.19 (it loads ES-module-only dependencies).
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 19)) {
  console.error(
    `\n  ✖ Node ${process.versions.node} is too old for this project (needs 20.19+, recommended 22).\n` +
      `    Run:  nvm use        (reads .nvmrc → Node 22)\n` +
      `    Or make it permanent:  nvm alias default 22\n`,
  );
  process.exit(1);
}
