import { PrincessCardAnimated } from "@/components/PrincessCard";

export default function PrincessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "#0f0080" }}
    >
      <div style={{ width: "100%", maxWidth: 680 }}>
        <PrincessCardAnimated />
      </div>
    </div>
  );
}
