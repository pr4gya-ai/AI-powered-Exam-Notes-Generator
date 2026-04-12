import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  suppressErrorRendering: true,
});

const normalizeMermaid = (diagram) => {
  if (!diagram || typeof diagram !== "string") return "";

  let text = diagram.trim();

  // Remove markdown fences if the AI returns them
  text = text.replace(/```mermaid\s*/gi, "").replace(/```/g, "").trim();

  // If user provided a plain node list without graph declaration, add graph TD by default
  if (!/^graph\s+(TD|LR)\b/i.test(text)) {
    text = `graph TD\n${text}`;
  }

  return text;
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = normalizeMermaid(diagram);

    if (!chart) {
      containerRef.current.innerHTML = "<div class='text-sm text-gray-500'>No diagram provided.</div>";
      return;
    }

    const renderMermaid = async () => {
      try {
        const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const result = await mermaid.render(uniqueId, chart);

        let svg = "";
        if (typeof result === "string") svg = result;
        else if (result && result.svg) svg = result.svg;
        else if (result && result.html) svg = result.html;

        if (!svg) {
          throw new Error("Mermaid render returned no SVG output.");
        }

        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid render failed", error);
        containerRef.current.innerHTML = `<div style="color:#b91c1c; background:#fee2e2; padding:10px; border:1px solid #fca5a5; border-radius:6px;"><strong>Diagram render failed</strong><br/>${error?.message || "Unknown error"}</div>`;
      }
    };

    renderMermaid();
  }, [diagram]);

  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto w-full">
      <div ref={containerRef} style={{ minHeight: 200, width: "100%" }} />
    </div>
  );
}

export default MermaidSetup;
