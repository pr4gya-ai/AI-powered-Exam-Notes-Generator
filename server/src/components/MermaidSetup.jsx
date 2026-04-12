import React, { useRef } from "react";
import mermaid from "mermaid";
import { useEffect } from "react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/\r\n/g, "\n")
    .trim();


  if (!clean.startsWith("graph")) {
    clean = `graph TD\n${clean}`;
  } else if (clean.startsWith("graph ") && !clean.startsWith("graph TD") && !clean.startsWith("graph LR")) {
    
    clean = clean.replace(/^graph/, "graph TD");
  }

  return clean;
};

const autoFixNodes = (diagram) => {
  let index = 0;
  const used = new Map();

  return diagram.replace(/\[(.*?)\]/g, (match, label) => {
    const key = label.trim(); 

    if (used.has(key)) {
      return used.get(key);
    }

    index++;
    const id = `N${index}`; 
    const node = `${id}["${key}"]`;

    used.set(key, node);

    return node;
  });
};


function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) {
      console.log("MermaidSetup: No diagram or container", { diagram, container: !!containerRef.current });
      return;
    }

    const renderDiagram = async () => {
      try {
        console.log("MermaidSetup: Rendering diagram", diagram);
        containerRef.current.innerHTML = "";

        const uniqueId = `mermaid-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        // ✅ sanitize before render
        const safeChart = autoFixNodes(cleanMermaidChart(diagram));
        console.log("MermaidSetup: Safe chart", safeChart);

        const result = await mermaid.render(uniqueId, safeChart);
        console.log("MermaidSetup: Render result", result);

        let svg;
        if (typeof result === 'string') {
          svg = result;
        } else if (result && result.svg) {
          svg = result.svg;
        } else {
          throw new Error('Invalid render result');
        }

        containerRef.current.innerHTML = svg;
        console.log("MermaidSetup: Diagram rendered successfully");
      } catch (error) {
        console.error("Mermaid render failed:", error);
        // Show error message in the container
        containerRef.current.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">Failed to render diagram: ${error.message}</div>`;
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto">
      <div
        ref={containerRef}
        style={{
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      ></div>
    </div>
  );
}

export default MermaidSetup;