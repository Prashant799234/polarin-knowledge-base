import type { CSSProperties } from "react";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Base skeleton element ────────────────────────────────────────────────────

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div
      className="pk-skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  );
}

// ── DC Table row skeleton ────────────────────────────────────────────────────

export function DCTableRowSkeleton({ cols = 4 }: { cols?: number }) {
  const colConfigs = [
    // org: logo + text
    <td key="org" style={{ padding: "14px 8px 14px 16px", verticalAlign: "middle" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Skeleton width={32} height={32} borderRadius={8} />
        <Skeleton width={80} height={14} />
      </div>
    </td>,
    // dc name
    <td key="name" style={{ padding: "14px 8px", verticalAlign: "middle" }}>
      <Skeleton width="75%" height={14} />
    </td>,
    // city/country
    <td key="city" style={{ padding: "14px 8px", verticalAlign: "middle" }}>
      <Skeleton width="60%" height={14} />
    </td>,
    // address
    <td key="addr" style={{ padding: "14px 8px", verticalAlign: "middle" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width="90%" height={14} />
        <Skeleton width="55%" height={14} />
      </div>
    </td>,
  ].slice(0, cols);

  return <tr style={{ borderBottom: "1px solid #e2e8f1" }}>{colConfigs}</tr>;
}

/** Full DC table skeleton — shows N placeholder rows */
export function DCTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <DCTableRowSkeleton key={i} />
      ))}
    </>
  );
}

// ── Welcome page card skeleton ───────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e2e8f1",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
      }}
    >
      <Skeleton width={40} height={40} borderRadius={12} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width="50%" height={14} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="80%" height={12} />
        <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
      </div>
    </div>
  );
}

// ── Sidebar item skeleton ─────────────────────────────────────────────────────

export function SidebarItemSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
      <Skeleton width={20} height={20} borderRadius={4} />
      <Skeleton width="60%" height={14} />
    </div>
  );
}

// ── Search results skeleton ───────────────────────────────────────────────────

export function SearchResultSkeleton() {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <Skeleton width="40%" height={14} />
      <Skeleton width="75%" height={12} />
    </div>
  );
}

export function SearchLoadingState({ label = "Searching..." }: { label?: string }) {
  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Label */}
      <p
        style={{
          fontFamily: FONT,
          fontSize: 12,
          color: "#90a2b9",
          margin: "0 0 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#1c808d",
            display: "inline-block",
            animation: "pk-shimmer 1.2s ease-in-out infinite",
          }}
        />
        {label}
      </p>

      {/* Skeleton rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Release notes skeleton ────────────────────────────────────────────────────

export function ReleaseCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f1",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0px 0px 1px rgba(40,41,61,0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width={120} height={20} />
          <Skeleton width={160} height={12} />
        </div>
        <Skeleton width={60} height={26} borderRadius={16} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Skeleton width="100%" height={54} borderRadius={12} />
        <Skeleton width="100%" height={54} borderRadius={12} />
        <Skeleton width="100%" height={54} borderRadius={12} />
      </div>
    </div>
  );
}
