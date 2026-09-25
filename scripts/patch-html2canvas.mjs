import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = [
  resolve(__dirname, "../node_modules/html2canvas/dist/html2canvas.js"),
  resolve(__dirname, "../node_modules/html2canvas/dist/html2canvas.esm.js"),
];

for (const file of files) {
  if (!existsSync(file)) continue;
  let content = readFileSync(file, "utf-8");
  let modified = false;

  // 1. Patch unsupported color crash (oklch, color-mix, etc.)
  if (content.includes("throw new Error(\"Attempting to parse an unsupported color function \\\"\" + color + \"\\\"\");")) {
    content = content.replace(
      "throw new Error(\"Attempting to parse an unsupported color function \\\"\" + color + \"\\\"\");",
      "return COLORS.TRANSPARENT;"
    );
    modified = true;
  }

  // 2. Ensure offset += text.length exists in parseTextBounds
  if (!content.includes("offset += text.length;")) {
    content = content.replace(
      /(else if \(!FEATURES\.SUPPORT_RANGE_BOUNDS\) \{\s*node = node\.splitText\(text\.length\);\s*\})/,
      "$1\n            offset += text.length;"
    );
    modified = true;
  }

  // NOTE: a previous patch (3) inserted a "minSpace" heuristic into
  // parseTextBounds that force-shifted any two same-line text bounds
  // apart if they were "too close". It was meant to fix rare overlap
  // between adjacent inline elements (e.g. text immediately followed by
  // a <strong> or <button>), but it applied to EVERY text-bounds pair
  // html2canvas measures — including normal, already-correctly-spaced
  // words within a single accurately-measured text node. That corrupted
  // word spacing across every paragraph (visible as stretched, justify-
  // looking text) and made lines overflow their container width, which
  // is what actually caused the overlapping/garbled PDF and print
  // output. Removed — do not reintroduce without reproducing the
  // original narrow bug first and scoping a fix to it specifically.

  if (modified) {
    writeFileSync(file, content, "utf-8");
    console.log(`[patch-html2canvas] Patched ${file}`);
  }
}

// Patch jsPDF to add /H /U (underline on hover/click) and /NewWindow true (open in new tab)
const jspdfFiles = [
  resolve(__dirname, "../node_modules/jspdf/dist/jspdf.es.min.js"),
  resolve(__dirname, "../node_modules/jspdf/dist/jspdf.umd.min.js"),
  resolve(__dirname, "../node_modules/jspdf/dist/jspdf.node.min.js"),
  resolve(__dirname, "../node_modules/jspdf/dist/jspdf.es.js"),
];

for (const file of jspdfFiles) {
  if (!existsSync(file)) continue;
  let content = readFileSync(file, "utf-8");
  let modified = false;

  if (!content.includes("/H /U") && content.includes("<</Type /Annot /Subtype /Link")) {
    content = content.replace(
      /\/Border \[0 0 0\] \/A <<\/S \/URI \/URI \("\+f\(d\(r\.options\.url\)\)\+"\)/g,
      "/H /U /Border [0 0 0] /A <</S /URI /URI (\"+f(d(r.options.url))+\") /NewWindow true"
    );
    content = content.replace(
      /\/Border \[0 0 0\] \/A <<\/S \/URI \/URI \("\+escape\(encryptor\(anno\.options\.url\)\)\+"\)/g,
      "/H /U /Border [0 0 0] /A <</S /URI /URI (\"+escape(encryptor(anno.options.url))+\") /NewWindow true"
    );
    modified = true;
  }

  if (modified) {
    writeFileSync(file, content, "utf-8");
    console.log(`[patch-jspdf] Patched ${file}`);
  }
}

