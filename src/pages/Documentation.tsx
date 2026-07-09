import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidViewer } from "../components/atoms/MermaidViewer";
import { BookOpen } from "lucide-react";

export const Documentation: React.FC = () => {
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [activeSpec, setActiveSpec] = useState<string>("");

  useEffect(() => {
    // Load all markdown files from docs/specs
    const loadSpecs = async () => {
      const modules = import.meta.glob("../../../docs/specs/*.md", {
        query: "?raw",
        import: "default",
      });
      const loadedSpecs: Record<string, string> = {};

      for (const path in modules) {
        const name = path.split("/").pop()?.replace(".md", "") || "Unknown";
        // The import yields a string because of ?raw
        const content = (await modules[path]()) as unknown as string;
        loadedSpecs[name] = content;
      }

      setSpecs(loadedSpecs);
      const keys = Object.keys(loadedSpecs);
      if (keys.length > 0) {
        // Find auth_spec or just first one
        setActiveSpec(keys.includes("auth_spec") ? "auth_spec" : keys[0]);
      }
    };

    loadSpecs();
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", gap: "var(--spacing-xl)" }}>
      {/* Sidebar for Docs */}
      <div
        style={{
          width: "250px",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--spacing-md)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            color: "var(--primary-dark)",
            fontWeight: 700,
          }}
        >
          <BookOpen size={20} />
          <span style={{ fontSize: "1.1rem" }}>Tài liệu hệ thống</span>
        </div>

        {Object.keys(specs)
          .sort()
          .map((key) => (
            <button
              key={key}
              onClick={() => setActiveSpec(key)}
              style={{
                padding: "0.75rem 1rem",
                textAlign: "left",
                background: activeSpec === key ? "var(--primary)" : "transparent",
                color: activeSpec === key ? "#ffffff" : "var(--text-main)",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontWeight: activeSpec === key ? 600 : 500,
                transition: "all 0.2s",
              }}
            >
              {key.replace("_spec", "").toUpperCase()} Schema
            </button>
          ))}
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          border: "1px solid var(--border)",
          overflowY: "auto",
        }}
      >
        {activeSpec && specs[activeSpec] ? (
          <div className="markdown-body" style={{ lineHeight: 1.6, color: "var(--text-main)" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node: _node, ...props }: any) => (
                  <h1
                    style={{
                      color: "var(--primary-dark)",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.5rem",
                      marginBottom: "1.5rem",
                    }}
                    {...props}
                  />
                ),
                h2: ({ node: _node, ...props }: any) => (
                  <h2
                    style={{
                      color: "var(--primary)",
                      marginTop: "2rem",
                      marginBottom: "1rem",
                    }}
                    {...props}
                  />
                ),
                table: ({ node: _node, ...props }: any) => (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      margin: "1rem 0",
                    }}
                    {...props}
                  />
                ),
                th: ({ node: _node, ...props }: any) => (
                  <th
                    style={{
                      borderBottom: "2px solid var(--border)",
                      padding: "0.75rem",
                      textAlign: "left",
                      backgroundColor: "var(--surface-alt)",
                      color: "var(--text-main)",
                    }}
                    {...props}
                  />
                ),
                td: ({ node: _node, ...props }: any) => (
                  <td
                    style={{
                      borderBottom: "1px solid var(--border)",
                      padding: "0.75rem",
                    }}
                    {...props}
                  />
                ),
                code({ _node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  // Intercept Mermaid code blocks
                  if (!inline && match && match[1] === "mermaid") {
                    return <MermaidViewer chart={String(children).replace(/\n$/, "")} />;
                  }
                  // Normal inline code
                  return inline ? (
                    <code
                      style={{
                        background: "var(--surface-alt)",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                        fontSize: "0.9em",
                        color: "#e11d48",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre
                      style={{
                        background: "var(--surface-alt)",
                        padding: "1rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {specs[activeSpec]}
            </ReactMarkdown>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "var(--text-muted)",
            }}
          >
            Loading documentation...
          </div>
        )}
      </div>
    </div>
  );
};
