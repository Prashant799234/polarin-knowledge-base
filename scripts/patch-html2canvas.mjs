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

  // 3. Ensure minSpace spacing guard exists in parseTextBounds
  if (!content.includes("var minSpace =")) {
    content = content.replace(
      /(\s*return textBounds;\s*\n\s*\};)/,
      `\n    var minSpace = (styles.fontSize && styles.fontSize.number ? styles.fontSize.number : 14) * 0.28;
    for (var i = 1; i < textBounds.length; i++) {
        var prev = textBounds[i - 1];
        var curr = textBounds[i];
        if (Math.abs(curr.bounds.top - prev.bounds.top) < 6) {
            var prevRight = prev.bounds.left + prev.bounds.width;
            if (curr.bounds.left < prevRight + minSpace) {
                curr.bounds = new Bounds(prevRight + minSpace, curr.bounds.top, curr.bounds.width, curr.bounds.height);
            }
        }
    }$1`
    );
    modified = true;
  }

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

