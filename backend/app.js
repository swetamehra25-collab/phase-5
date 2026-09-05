
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const app = express();

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
const frontendPath = path.join(__dirname, "../Frontend");

app.use(express.static(frontendPath));

// Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Ask Gemini
app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        console.log("Question:", question);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question briefly in 2-3 sentences: ${question}`
        });

        res.json({
            message: response.text
        });

    } catch (error) {
        console.error("GEMINI ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

// IMPORTANT FOR VERCEL
export default app;

app.listen(3000, () => {
    console.log(`Server running on port ${PORT}`);
});