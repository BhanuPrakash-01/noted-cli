const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log("noted - a tiny notes CLI");
  console.log("");
  console.log("Usage:");
  console.log("  noted --help        Print this help.");
  process.exit(0);
}

console.error(`unknown command: ${args.join(" ")}`);
process.exit(2);
