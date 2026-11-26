// Aldermere National Statistics — entry program (Node 22, standard library
// only). The site is the plain static files in app/ beside this file; the
// screenshots are in screenshots/. This program hands the entry in: it
// copies app/ and screenshots/ to /output (or MAKEFUN_OUTPUT_DIR outside
// the grader) and writes /output/dossier.json with buildDossier from the
// vendored make.fun library, vendor/makefun-frontend.ts, which is the
// kit's copy unchanged. Both runs write the same bytes: the copy is a
// plain recursive copy and the dossier is built deterministically from
// the files in /output.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps match the scorer's gate: at most 4 screenshots of 256 KiB each,
// at most 993 files and 16 MiB in app/, dossier text at most 160 KiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
