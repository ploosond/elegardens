"use client";

import { useMemo } from "react";

interface RichTextProps {
  data: any;
  className?: string;
}

// Enhanced Lexical JSON to HTML renderer
function lexicalToHtml(lexicalData: any): string {
  if (!lexicalData) return "";

  // Handle string data
  if (typeof lexicalData === "string") return lexicalData;

  // Handle Lexical JSON structure
  const root = lexicalData.root || lexicalData;
  if (!root) return "";

  function processNode(node: any): string {
    if (!node) return "";

    let result = "";
    const children = node.children || [];

    // Process children first
    for (const child of children) {
      result += processNode(child);
    }

    const nodeType = node.type || node.nodeType || "";

    switch (nodeType) {
      case "paragraph":
        return result ? `<p class="mb-4">${result}</p>` : "";
      case "heading": {
        const tag = node.tag || "h2";
        const level = tag.replace("h", "") || "2";
        return result
          ? `<${tag} class="mb-4 text-${
              level === "1" ? "2xl" : level === "2" ? "xl" : "lg"
            } font-semibold text-secondary">${result}</${tag}>`
          : "";
      }
      case "text": {
        let text = node.text || "";
        if (!text) return "";

        // Apply formatting
        if (node.format) {
          const format =
            typeof node.format === "number"
              ? node.format
              : parseInt(node.format, 10) || 0;
          if (format & 1) text = `<strong>${text}</strong>`; // bold
          if (format & 2) text = `<em>${text}</em>`; // italic
          if (format & 4) text = `<u>${text}</u>`; // underline
        }
        return text;
      }
      case "list": {
        const listType = node.listType || "bullet";
        const listTag = listType === "number" ? "ol" : "ul";
        // Use list-outside for better bullet visibility, and ensure proper spacing
        // Add inline style to ensure bullets are visible
        const listStyle =
          listType === "number"
            ? 'style="list-style-type: decimal; list-style-position: outside; padding-left: 1.5rem;"'
            : 'style="list-style-type: disc; list-style-position: outside; padding-left: 1.5rem;"';
        const listClass = "space-y-2 mb-4";
        return result
          ? `<${listTag} class="${listClass}" ${listStyle}>${result}</${listTag}>`
          : "";
      }
      case "listitem":
        return result
          ? `<li class="mb-1" style="display: list-item;">${result}</li>`
          : "";
      case "link": {
        const url = node.url || node.fields?.url || node.attributes?.url || "#";
        const target = node.target || node.attributes?.target || "_self";
        return result
          ? `<a href="${url}" target="${target}" class="text-primary hover:underline">${result}</a>`
          : "";
      }
      case "linebreak":
        return "<br />";
      default:
        // For unknown types, just return the children content
        return result;
    }
  }

  // Process root children
  let html = "";
  const rootChildren = root.children || [];
  for (const child of rootChildren) {
    html += processNode(child);
  }

  return html;
}

export default function RichText({ data, className = "" }: RichTextProps) {
  const html = useMemo(() => {
    if (!data) return "";

    let processedHtml = "";

    if (typeof data === "string") {
      // If it's already HTML, ensure lists have proper attributes
      processedHtml = data;
    } else {
      processedHtml = lexicalToHtml(data);
    }

    // Post-process HTML to ensure all ul/ol elements have proper styling
    // This handles cases where HTML is pasted directly
    if (processedHtml.includes("<ul") || processedHtml.includes("<ol")) {
      // Add inline styles to existing ul/ol tags if they don't have them
      processedHtml = processedHtml.replace(
        /<ul(?![^>]*style)/gi,
        '<ul style="list-style-type: disc; list-style-position: outside; padding-left: 1.5rem;"',
      );
      processedHtml = processedHtml.replace(
        /<ol(?![^>]*style)/gi,
        '<ol style="list-style-type: decimal; list-style-position: outside; padding-left: 1.5rem;"',
      );
      // Ensure li elements are properly styled
      processedHtml = processedHtml.replace(
        /<li(?![^>]*style)/gi,
        '<li style="display: list-item;"',
      );
    }

    return processedHtml;
  }, [data]);

  if (!html) return null;

  return (
    <div
      className={`prose prose-base max-w-none rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
