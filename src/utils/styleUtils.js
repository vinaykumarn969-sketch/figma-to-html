export function styleFromNode(node) {
  const styles = [];

  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === "SOLID") {
      const color = fill.color;
      const rgb = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
      styles.push(`background-color:${rgb};`);
    }
  }

  const box = node.absoluteBoundingBox;
  if (box) {
    styles.push(`width:${box.width}px;height:${box.height}px;`);
    styles.push(`position:absolute;left:${box.x}px;top:${box.y}px;`);
  }

  if (node.type === "TEXT") {
    const fills = node.fills || [];
    if (fills.length > 0) {
      const color = fills[0].color;
      const rgb = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
      styles.push(`color:${rgb};`);
    }
    const fontSize = node.style?.fontSize || 16;
    styles.push(`font-size:${fontSize}px;`);
  }

  return styles.join(" ");
}
