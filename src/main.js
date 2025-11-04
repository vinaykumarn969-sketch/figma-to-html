import fs from "fs-extra";
import dotenv from "dotenv";
import OpenAI from "openai";
import open from "open";
import { getFigmaFile } from "./figmaApi.js";
 
dotenv.config();
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
async function main() {
  try {
    console.log("🚀 Fetching Figma design file...");
 
    let figmaJSON;
 
    // ✅ Try fetching from Figma API
    try {
      figmaJSON = await getFigmaFile();
      await fs.writeJson("output/figma_raw.json", figmaJSON);
      console.log("✅ Latest Figma JSON saved to output/figma_raw.json");
    } catch (apiError) {
      console.warn("⚠️ Figma API fetch failed. Using local figma_raw.json...");
      figmaJSON = await fs.readJson("output/figma_raw.json");
    }
 
    console.log("🤖 Sending design to ChatGPT...");
 
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert frontend developer and UI engineer specializing in design-to-code automation.
Your task is to convert a Figma file JSON into pixel-perfect HTML and CSS.
 
### Output Format:
1️⃣ Full HTML5 document (starting with <!DOCTYPE html>).
2️⃣ One CSS block enclosed in triple backticks (\`\`\`css ... \`\`\`).
 
### Conversion Rules:
- Respect the exact **absoluteBoundingBox** for size and position (x, y, width, height).
- Use **position: absolute** for each node if it has coordinates.
- Use **flexbox or grid** only for grouped frames explicitly defined as layout containers.
- Apply **borderRadius**, **fills (colors/gradients)**, **strokes**, and **text styles (fontSize, color, fontWeight, lineHeight)** exactly as described.
- Match typography precisely (e.g., Inter font → use Google Fonts: Inter).
- For gradients, use \`background: linear-gradient(angle, color1, color2)\` using gradientStops and gradientHandlePositions.
- For text layers, render with exact font size, weight, color, and alignment.
- Center the design within a mobile-like viewport.
- Include background color or frame background (#FCFCFC if present).
- Do NOT include JavaScript or inline styles.
- Do NOT guess missing values—preserve all provided visual data.
 
### Output Goal:
Recreate the design *exactly* as it appears in Figma, including gradients, spacing, rounded corners, and colors.
 
Return only:
- the <html> document
- and the \`\`\`css ... \`\`\` block.
          `,
        },
        {
          role: "user",
          content: JSON.stringify(figmaJSON),
        },
      ],
      temperature: 0.25,
    });
 
    const result = completion.choices[0].message.content;
 
    // ✅ Extract HTML and CSS
    const htmlMatch = result.match(/<html[\s\S]*<\/html>/i);
    const cssMatch = result.match(/```css([\s\S]*?)```/i);
 
    const html = htmlMatch ? htmlMatch[0] : "<p>No HTML found.</p>";
    const css = cssMatch ? cssMatch[1].trim() : "/* No CSS found */";
 
    // ✅ Save as separate files
    await fs.writeFile("output/index.html", html);
    await fs.writeFile("output/style.css", css);
 
    // ✅ Embed CSS into HTML for standalone file
    const combinedHTML = html.replace(
      "</head>",
      `<style>\n${css}\n</style>\n</head>`
    );
    await fs.writeFile("output/combined.html", combinedHTML);
 
    console.log("✅ HTML & CSS generated successfully in /output");
    console.log("🧩 Created combined.html with inline CSS");
    console.log("🌐 Opening combined.html in browser...");
 
    await open("output/combined.html");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}
 
main();