import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

const BASE_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`;

const headers = {
  "X-Figma-Token": FIGMA_TOKEN
};

export async function getFigmaFile() {
  const res = await axios.get(BASE_URL, { headers });
  return res.data;
}
