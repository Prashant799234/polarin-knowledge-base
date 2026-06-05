import { KnowledgeBase } from "./components/knowledge-base/KnowledgeBase";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#F8FAFC",
      }}
    >
      <KnowledgeBase />
    </div>
  );
}
