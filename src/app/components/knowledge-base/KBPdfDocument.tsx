import { Document, Page, View, Text, Image, Link, Font, StyleSheet } from "@react-pdf/renderer";
import type { PdfNode, Run, CalloutVariant } from "./extractPdfContent";

// Real font files, not CSS @font-face links — react-pdf needs actual binaries
// to embed so the PDF matches the on-screen page exactly, with no font-loading
// race and no canvas-rasterization artifacts.
// react-pdf requires an exact registered file for every (weight, style)
// combination a Text node ends up requesting — an unregistered italic at an
// otherwise-registered weight throws, it doesn't just fall back to upright.
// We don't have real italic cuts of either family, so register the upright
// files again under fontStyle: "italic" as a safe fallback (renders upright,
// never crashes) in case any content ever uses <em>/<i>.
Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Light.ttf", fontWeight: 300 },
    { src: "/fonts/Lato-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Lato-Black.ttf", fontWeight: 900 },
    { src: "/fonts/Lato-Light.ttf", fontWeight: 300, fontStyle: "italic" },
    { src: "/fonts/Lato-Regular.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: 700, fontStyle: "italic" },
    { src: "/fonts/Lato-Black.ttf", fontWeight: 900, fontStyle: "italic" },
  ],
});
Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: "/fonts/PlusJakartaSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/PlusJakartaSans-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/PlusJakartaSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/PlusJakartaSans-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/PlusJakartaSans-ExtraBold.ttf", fontWeight: 800 },
    { src: "/fonts/PlusJakartaSans-Regular.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/PlusJakartaSans-Medium.ttf", fontWeight: 500, fontStyle: "italic" },
    { src: "/fonts/PlusJakartaSans-SemiBold.ttf", fontWeight: 600, fontStyle: "italic" },
    { src: "/fonts/PlusJakartaSans-Bold.ttf", fontWeight: 700, fontStyle: "italic" },
    { src: "/fonts/PlusJakartaSans-ExtraBold.ttf", fontWeight: 800, fontStyle: "italic" },
  ],
});
Font.registerHyphenationCallback((word) => [word]); // never hyphenate mid-word

const NAVY = "#0a3954";
const TEAL = "#1c808d";
const MUTED = "#64748b";
const BODY = "#1e293b";
const RULE = "#cbd5e1";
const LINK = "#1367d6";

const CV: Record<CalloutVariant, { accent: string; bg: string; label: string; labelColor: string }> = {
  info:      { accent: "#0ea5e9", bg: "#f0f9ff", label: "Note",      labelColor: "#0369a1" },
  warning:   { accent: "#f59e0b", bg: "#fffbeb", label: "Warning",   labelColor: "#b45309" },
  tip:       { accent: "#10b981", bg: "#f0fdf4", label: "Tip",       labelColor: "#059669" },
  important: { accent: "#8b5cf6", bg: "#faf5ff", label: "Important", labelColor: "#6d28d9" },
};

const HEADER_H = 54;
const FOOTER_H = 34;

const s = StyleSheet.create({
  page: {
    fontFamily: "Lato",
    fontSize: 10.5,
    color: BODY,
    paddingTop: HEADER_H + 20,
    paddingBottom: FOOTER_H + 16,
    paddingHorizontal: 40,
  },
  header: {
    position: "absolute", top: 0, left: 0, right: 0, height: HEADER_H,
    paddingHorizontal: 40, paddingTop: 18,
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
    borderBottom: `1pt solid ${RULE}`,
  },
  logo: { height: 20 },
  headerRight: { alignItems: "flex-end" },
  headerTitle: { fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 10, color: NAVY },
  headerDate: { fontSize: 8, color: MUTED, marginTop: 2 },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: FOOTER_H,
    paddingHorizontal: 40, paddingTop: 10,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderTop: `0.5pt solid ${RULE}`,
  },
  footerText: { fontSize: 8, color: MUTED },

  h1: { fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 21, color: NAVY, marginBottom: 14, lineHeight: 1.25 },
  h2: { fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, color: NAVY, marginTop: 20, marginBottom: 8, paddingTop: 14, borderTop: `0.5pt solid #f1f5f9` },
  h3: { fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 12.5, color: "#1c3d5a", marginTop: 12, marginBottom: 6 },
  p: { fontSize: 10.5, lineHeight: 1.6, marginBottom: 10 },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  code: { fontFamily: "Courier", fontSize: 9.5, backgroundColor: "#f1f5f9", color: "#0f766e" },
  link: { color: LINK, textDecoration: "underline" },

  listItem: { flexDirection: "row", marginBottom: 6 },
  bullet: { width: 12, fontSize: 10.5, color: TEAL },
  listItemText: { flex: 1, fontSize: 10.5, lineHeight: 1.6 },

  callout: { flexDirection: "row", marginVertical: 12, borderRadius: 4, padding: "10pt 14pt" },
  calloutBar: { width: 3, marginRight: 10, borderRadius: 2 },
  calloutLabel: { fontWeight: 700 },
  calloutText: { fontSize: 10, lineHeight: 1.6, flex: 1 },

  table: { border: `0.75pt solid #e5e7eb`, borderRadius: 4, marginVertical: 12 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#f8fafc", borderBottom: `1pt solid #e2e8f0` },
  tableRow: { flexDirection: "row", borderBottom: `0.5pt solid #f1f5f9` },
  th: { flex: 1, fontSize: 8, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", padding: "7pt 10pt" },
  td: { flex: 1, fontSize: 9.5, color: BODY, padding: "8pt 10pt", lineHeight: 1.5 },
  pillRequired: { fontSize: 8, fontWeight: 700, color: "#b91c1c", backgroundColor: "#fef2f2", borderRadius: 8, padding: "2pt 7pt", alignSelf: "flex-start" },
  pillOptional: { fontSize: 8, fontWeight: 600, color: "#475569", backgroundColor: "#f1f5f9", borderRadius: 8, padding: "2pt 7pt", alignSelf: "flex-start" },

  figure: { marginVertical: 14, border: `0.75pt solid #e5e7eb`, borderRadius: 4 },
  figureImg: { width: "100%" },
  figureCaption: { fontSize: 8, color: "#9ca3af", textAlign: "center", padding: "6pt 10pt", backgroundColor: "#f9fafb", borderTop: `0.5pt solid #f3f4f6` },

  stepRow: { flexDirection: "row", marginBottom: 14 },
  stepNum: {
    width: 20, height: 20, borderRadius: 10, border: `1.3pt solid ${TEAL}`,
    alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 1,
  },
  stepNumText: { fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 9, color: TEAL },
  stepTitle: { fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 10.5, color: NAVY, marginBottom: 4 },
  caption: { fontSize: 9, color: MUTED, marginTop: -6, marginBottom: 12 },

  genericBlock: { marginBottom: 10, paddingLeft: 10, borderLeft: `2pt solid #e2e8f0` },
  genericHeading: { fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 10.5, color: NAVY, marginBottom: 3 },
  genericText: { fontSize: 9.5, lineHeight: 1.55, color: "#475569" },
});

function renderRuns(runs: Run[], baseStyle: object) {
  return runs.map((r, i) => {
    const style: object[] = [baseStyle];
    if (r.bold) style.push(s.bold);
    if (r.italic) style.push(s.italic);
    if (r.code) style.push(s.code);
    if (r.link) {
      style.push(s.link);
      return (
        <Link key={i} src={r.link} style={style}>
          {r.text}
        </Link>
      );
    }
    return (
      <Text key={i} style={style}>
        {r.text}
      </Text>
    );
  });
}

function renderNode(node: PdfNode, i: number) {
  switch (node.type) {
    case "heading":
      return (
        <Text key={i} style={node.level === 1 ? s.h1 : node.level === 2 ? s.h2 : s.h3}>
          {node.text}
        </Text>
      );
    case "paragraph":
      return (
        <Text key={i} style={s.p}>
          {renderRuns(node.runs, {})}
        </Text>
      );
    case "list":
      return (
        <View key={i} style={{ marginBottom: 10 }}>
          {node.items.map((runs, j) => (
            <View key={j} style={s.listItem}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.listItemText}>{renderRuns(runs, {})}</Text>
            </View>
          ))}
        </View>
      );
    case "callout": {
      const cv = CV[node.variant];
      return (
        <View key={i} style={[s.callout, { backgroundColor: cv.bg }]} wrap={false}>
          <View style={[s.calloutBar, { backgroundColor: cv.accent }]} />
          <Text style={s.calloutText}>
            <Text style={[s.calloutLabel, { color: cv.labelColor }]}>{cv.label}: </Text>
            {renderRuns(node.runs, {})}
          </Text>
        </View>
      );
    }
    case "table":
      return (
        <View key={i} style={s.table} wrap={false}>
          {node.headers.length > 0 && (
            <View style={s.tableHeaderRow}>
              {node.headers.map((h, j) => (
                <Text key={j} style={s.th}>{h}</Text>
              ))}
            </View>
          )}
          {node.rows.map((row, j) => (
            <View key={j} style={[s.tableRow, j === node.rows.length - 1 ? { borderBottom: "none" } : {}]}>
              {row.map((cell, k) => {
                if (cell === "Required") return <View key={k} style={s.td}><Text style={s.pillRequired}>Required</Text></View>;
                if (cell === "Optional") return <View key={k} style={s.td}><Text style={s.pillOptional}>Optional</Text></View>;
                return <Text key={k} style={s.td}>{cell}</Text>;
              })}
            </View>
          ))}
        </View>
      );
    case "image":
      return (
        <View key={i} style={s.figure} wrap={false}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={node.src} style={s.figureImg} />
          {node.caption && <Text style={s.figureCaption}>{node.caption}</Text>}
        </View>
      );
    case "steps":
      return (
        <View key={i} style={{ marginVertical: 12 }}>
          {node.items.map((step, j) => (
            <View key={j} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{step.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {step.title && <Text style={s.stepTitle}>{step.title}</Text>}
                {step.blocks.map((b, k) => renderNode(b, k))}
              </View>
            </View>
          ))}
        </View>
      );
    case "caption":
      return (
        <Text key={i} style={s.caption}>{node.text}</Text>
      );
    case "generic":
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          {node.blocks.map((b, j) => (
            <View key={j} style={s.genericBlock} wrap={false}>
              {b.heading && <Text style={s.genericHeading}>{b.heading}</Text>}
              {b.text && <Text style={s.genericText}>{b.text}</Text>}
            </View>
          ))}
        </View>
      );
    default:
      return null;
  }
}

interface Props {
  nodes: PdfNode[];
  pageTitle: string;
  logoSrc: string;
  generatedOn: string;
}

const PLATFORM_URL = "https://polarin.lightstorm.net/app/login?next=/app/home";
const DOCS_BASE_URL = "https://docs.polarin.lightstorm.net";

export function KBPdfDocument({ nodes, pageTitle, logoSrc, generatedOn }: Props) {
  return (
    <Document title={pageTitle} author="Polarin Docs">
      <Page size="A4" style={s.page} wrap>
        <View style={s.header} fixed>
          <Image src={logoSrc} style={s.logo} />
          <View style={s.headerRight}>
            <Text style={s.headerTitle}>Polarin Documentation</Text>
            <Text style={s.headerDate}>{generatedOn}</Text>
          </View>
        </View>

        {nodes.map(renderNode)}

        <View style={{ marginTop: 16, paddingTop: 14, borderTop: `1pt solid ${RULE}` }}>
          <Text style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11, color: NAVY, marginBottom: 8 }}>
            More from Polarin
          </Text>
          {[
            { label: "Polarin Portal", value: "polarin.lightstorm.net", href: PLATFORM_URL },
            { label: "Knowledge Base", value: "docs.polarin.lightstorm.net", href: DOCS_BASE_URL },
            { label: "Support Email", value: "polarinsupport@lightstorm.net", href: "mailto:polarinsupport@lightstorm.net" },
            { label: "Support Phone", value: "+91 22 6931 5544", href: "tel:+912269315544" },
          ].map((r) => (
            <Text key={r.label} style={{ fontSize: 9, marginBottom: 4 }}>
              <Text style={{ fontWeight: 700 }}>{r.label}: </Text>
              <Link src={r.href} style={{ color: LINK }}>{r.value}</Link>
            </Text>
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Polarin Docs · Confidential &amp; Proprietary</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
