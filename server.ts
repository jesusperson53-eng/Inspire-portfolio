import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const getArgValue = (argName: string): string | undefined => {
  const index = process.argv.indexOf(argName);
  return index !== -1 && index + 1 < process.argv.length ? process.argv[index + 1] : undefined;
};

const port = Number(getArgValue('--port') || (process.env.PORT && !isNaN(Number(process.env.PORT)) ? process.env.PORT : 3000));
const host = getArgValue('--host') || '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Advisor Endpoint for Inspire Business Academy
app.post('/api/ai/advisor', async (req: Request, res: Response) => {
  try {
    const { prompt, mode, courseContext, studentContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      // Provide an intelligent fallback response if API key is not configured in local environment
      return res.json({
        text: `[Academy Advisory System]: Thank you for your question regarding ${courseContext?.title || 'your coursework'}. \n\nFor assignments in ${courseContext?.title || 'Professional Development'}:\n1. Ensure all practical requirements and code repositories are clearly documented.\n2. Review test cases and edge cases before submission.\n3. Include a detailed reflection in 'What I Learned' highlighting challenges solved.\n\nKeep up the dedicated work! (Configure GEMINI_API_KEY for live real-time AI reasoning).`,
        mode,
      });
    }

    const systemInstruction = `You are the Inspire Business Academy Senior Academic & Industry Mentor.
Inspire Business Academy is a premier professional institute offering high-impact programs including:
- MERN Full Stack Web Development
- Python, Machine Learning & AI Engineering
- UI/UX Design & Product Architecture
- Digital Marketing, Performance Ads & Analytics
- Flutter Cross-Platform Mobile App Development
- Graphic Design, Motion Graphics & Visual Branding
- WordPress, E-Commerce & Freelancing Mastery
- SEO, Content Strategy & Copywriting
- Cloud Computing & DevOps Architecture

Guidelines:
- Provide rigorous, professional, encouraging, and actionable guidance for students, faculty, and reviewers.
- When reviewing assignment queries, examine logic, clean code, design fidelity, and best practices.
- Give concrete code snippets, architectural tips, and constructive critiques.
- Respond in clear, professional English (or Urdu if queried in Urdu).
- Format output with clean markdown headings and bullet points.`;

    // Complex academic reasoning with ThinkingLevel.HIGH as mandated
    const response = await aiClient.models.generateContent({
      model: 'gemini-4-argon',
      contents: `Context: ${JSON.stringify({ courseContext, studentContext, mode })}\n\nStudent/Instructor Query: ${prompt}`,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const reply = response.text || 'Unable to generate response from academic mentor.';
    return res.json({ text: reply });
  } catch (err: any) {
    console.error('Error in /api/ai/advisor:', err);
    return res.status(500).json({
      error: 'Failed to process AI advisory request',
      details: err?.message || String(err),
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    academy: 'Inspire Business Academy',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`Inspire Business Academy running at http://${host}:${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
