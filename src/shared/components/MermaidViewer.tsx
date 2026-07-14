import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import styles from "./MermaidViewer.module.scss";

interface MermaidViewerProps {
  chart: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-family)",
    });

    const renderChart = async () => {
      try {
        if (containerRef.current) {
          const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvgContent(svg);
          setError(false);
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        setError(true);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return <div className={styles.error}>Failed to render Mermaid diagram. Please check the syntax.</div>;
  }

  return <div ref={containerRef} className={styles.container} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
