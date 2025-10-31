import { styleFromNode } from "./utils/styleUtils.js";

export function convertToHTML(figmaData) {
  const nodes = figmaData.document.children;
  const elements = [];

  for (const node of nodes) {
    if (node.type === "FRAME") {
      for (const child of node.children || []) {
        const style = styleFromNode(child);
        const text = child.characters || "";
        elements.push({ style, text });
      }
    }
  }

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Figma Mock</title>
      <link rel="stylesheet" href="style.css" />
  </head>
  <body>
      <div class="root">
          ${elements.map(el => `
            <div class="element" style="${el.style}">
              ${el.text || ""}
            </div>
          `).join("\n")}
      </div>
  </body>
  </html>
  `;

  return html;
}
