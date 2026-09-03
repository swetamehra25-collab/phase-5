import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const { GoogleGenAI } = await import("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

console.log(
    "API KEY STATUS:",
    process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND"
);

app.get("/", (req, res) => {
    res.send("backend is working");
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        console.log("Question:", question);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question briefly in 2-3 sentences: ${question}`
        });

        res.json({
            message: response.text
        });

    } catch (error) {
        console.log("GEMINI ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("server running on port 3000");
});