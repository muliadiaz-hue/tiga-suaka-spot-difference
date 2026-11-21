// Tiga Suaka — entrypoint (Node 22, standard library only).
// The program hands the game in: it copies game/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there,
// the summary the judge reads, built by the vendored make.fun library.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file from an earlier run
// can never leak into the hand-in. Only the directory's contents are removed:
// in the grader the output directory itself is a mount point, and removing
// it fails with EBUSY (run_completes, round 1).
mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) {
  rmSync(join(out, entry), { recursive: true, force: true });
}
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots of 256 KiB, at most 993 files and
// 48 MiB under game/, paths under 1000 bytes, and the dossier text capped at
// 160 KiB. These numbers are the gate's own limits, shared with the kit.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`Tiga Suaka handed in to ${out}`);

// A one-line summary for the operator: what the hand-in holds. Written to
// stdout only — it never lands in /output, so the two grader runs stay
// byte-identical.
const dossierBytes = readFileSync(join(out, 'dossier.json')).length;
console.log(`dossier.json: ${dossierBytes} bytes; game files + screenshots copied`);
