TASK: Add a `noted version` subcommand that prints the version from package.json
and exits 0. If the user runs `noted version --json`, output {"version":"<v>"}.

DONE WHEN:
- ./bin/noted version prints exactly the version string from package.json + newline
- ./bin/noted version --json prints valid JSON with a "version" key
- both invocations exit 0
- ./bin/noted whatever still exits 2
