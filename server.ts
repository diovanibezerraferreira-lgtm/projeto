import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Music generation endpoint using Lyria models
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt, model = 'lyria-3-clip-preview' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Chave de API do Gemini não configurada.',
        code: 'MISSING_API_KEY'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Validate model selection
    const selectedModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    const musicPrompt = prompt || 'Upbeat energetic home workout electronic fitness track with driving tempo 128 bpm, motivational drums and synth';

    const responseStream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: musicPrompt,
      config: {
        responseModalities: [Modality.AUDIO],
      }
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ error: 'Nenhum dado de áudio gerado pelo modelo.' });
    }

    return res.json({
      audioBase64,
      mimeType,
      lyrics,
      prompt: musicPrompt,
      model: selectedModel
    });
  } catch (error: any) {
    console.error('Error generating music:', error);
    return res.status(500).json({
      error: error?.message || 'Falha ao gerar música com Lyria',
      details: error?.toString()
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
