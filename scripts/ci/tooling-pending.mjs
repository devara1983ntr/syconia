#!/usr/bin/env node
/**
 * SYCONIA canonical-command guard (AGENT.md §6 command set).
 *
 * package.json declares the full canonical command set from the scaffold
 * (M1-T001) so the contract is visible and stable from day one. Commands
 * whose toolchain is owned by a later .ai task are routed here until that
 * task lands: the guard names the owning task and exits 2, so an absent
 * toolchain can never be mistaken for a passing run (AGENT.md §2.1.10 —
 * honest gated state, fail closed, never a silent downgrade).
 */
import process from "node:process";

const [command, ownerTask] = process.argv.slice(2);

if (!command || !ownerTask) {
  process.stderr.write("usage: tooling-pending.mjs <command> <owning-task-id>\n");
  process.exit(2);
}

const phase = ownerTask.slice(0, 2);
process.stderr.write(`syconia ${command}: the toolchain for this command arrives with task ${ownerTask}\n`);
process.stderr.write(`(.ai/tasks/${phase}/${ownerTask}.md). Until then this command fails closed (exit 2).\n`);
process.exit(2);
