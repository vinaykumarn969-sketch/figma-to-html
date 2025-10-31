import fs from "fs-extra";
import dotenv from "dotenv";
import OpenAI from "openai";
import open from "open";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    console.log("🚀 Reading Figma JSON...");
    const figmaJSON = await fs.readJson("output/figma_raw.json");

    console.log("🤖 Sending design to ChatGPT...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert frontend developer. Convert provided Figma JSON into clean, semantic HTML and CSS. Match layout, colors, gradients, borders, and spacing exactly. Use modern CSS.",
        },
        {
          role: "user",
          content: JSON.stringify(figmaJSON),
        },
      ],
      temperature: 0.2,
    });

    const result = completion.choices[0].message.content;

    
    const htmlMatch = result.match(/<html[\s\S]*<\/html>/i);
    const cssMatch = result.match(/```css([\s\S]*?)```/i);

    const html = htmlMatch ? htmlMatch[0] : "<p>No HTML found.</p>";
    const css = cssMatch ? cssMatch[1].trim() : "/* No CSS found */";

    
    await fs.writeFile("output/index.html", html);
    await fs.writeFile("output/style.css", css);

    console.log("✅ HTML & CSS generated successfully in /output");
    console.log("🌐 Opening in browser...");

    await open("output/index.html");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
