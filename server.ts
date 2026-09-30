import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Initialize Gemini AI client
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(geminiApiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // Image Generation endpoint
  app.post('/api/generate-image', async (req, res) => {
    const { animal, action, background, style, extraPrompt } = req.body || {};

    if (!animal || !action || !background || !style) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ thông tin: con vật, hành động, bối cảnh và phong cách.',
      });
    }

    const animalPrompt = animal.prompt || animal.vi || 'cute animal';
    const actionPrompt = action.prompt || action.vi || 'playing';
    const bgPrompt = background.prompt || background.vi || 'fairytale landscape';
    const stylePrompt = style.prompt || style.vi || 'cute 3d animation style';
    const extraDetails = extraPrompt ? `, ${extraPrompt.trim()}` : '';

    const enrichedPrompt = `A delightful, top-tier fairytale children's book illustration of ${animalPrompt}, ${actionPrompt}, situated ${bgPrompt}, rendered in ${stylePrompt}${extraDetails}, bright joyful pastel lighting, vibrant colors, clear focal point, cinematic composition, award-winning storybook art`;

    let generatedImageUrl: string | null = null;
    let providerUsed = 'none';

    // 1. First Attempt: Official Gemini Image Generation API
    if (ai) {
      try {
        // Try with gemini-3.1-flash-image
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [{ text: enrichedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            providerUsed = 'gemini-3.1-flash-image';
            break;
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini 3.1 Flash Image error:', geminiErr?.message || geminiErr);

        // Optional secondary attempt with gemini-3.1-flash-lite-image
        try {
          const liteResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: enrichedPrompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: '1:1',
              },
            },
          });

          const liteParts = liteResponse.candidates?.[0]?.content?.parts || [];
          for (const part of liteParts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              providerUsed = 'gemini-3.1-flash-lite-image';
              break;
            }
          }
        } catch (liteErr: any) {
          console.warn('Gemini 3.1 Flash Lite Image error:', liteErr?.message || liteErr);
        }
      }
    }

    // 2. High-reliability Fallback (ensuring every student in classroom can generate images smoothly)
    if (!generatedImageUrl) {
      try {
        const seed = Math.floor(Math.random() * 999999);
        const encoded = encodeURIComponent(enrichedPrompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=800&seed=${seed}&nologo=true&enhance=true`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const imgRes = await fetch(fallbackUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 TapVeTranhCungAI/1.0',
          },
        });
        clearTimeout(timeoutId);

        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          generatedImageUrl = `data:${contentType};base64,${base64}`;
          providerUsed = 'pollinations-flux-fallback';
        }
      } catch (pollinationErr: any) {
        console.warn('Fallback image fetch error:', pollinationErr?.message || pollinationErr);
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        provider: providerUsed,
      });
    }

    // If both network routes were blocked, return indicator for client SVG/Canvas fallback
    return res.json({
      success: true,
      imageUrl: null,
      useCanvasFallback: true,
      provider: 'client-art-canvas',
      prompt: enrichedPrompt,
    });
  });

  // Story generation endpoint using Gemini 3.8 Flash (fast, free tier, text task)
  app.post('/api/generate-story', async (req, res) => {
    const { animal, action, background, style } = req.body || {};

    const animalName = animal?.vi || 'bạn thú nhỏ';
    const actionName = action?.vi || 'vui chơi';
    const bgName = background?.vi || 'xứ sở thần tiên';

    let story = `Ngày xửa ngày xưa, tại ${bgName.toLowerCase()}, bạn ${animalName} vô cùng vui vẻ và hạnh phúc khi đang ${actionName.toLowerCase()}. Các bạn nhỏ trong khu rừng ai cũng yêu quý bạn ấy vì nụ cười rạng rỡ và sự tốt bụng!`;

    if (ai) {
      try {
        const prompt = `Bạn là một người kể chuyện cổ tích cho học sinh mầm non và tiểu học.
Hãy viết một câu chuyện cổ tích cực kỳ ngắn, khoảng 2 đến 3 câu văn tiếng Việt thật sinh động, trong trẻo, đáng yêu về:
- Nhân vật: ${animalName}
- Đang làm gì: ${actionName}
- Ở đâu: ${bgName}
Hãy viết giọng văn ấm áp, tràn đầy tình thương và niềm vui cho các em nhỏ. Không cần tiêu đề.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          story = text;
        }
      } catch (err: any) {
        console.warn('Gemini story generation error:', err?.message || err);
      }
    }

    res.json({
      success: true,
      story,
    });
  });

  // Setup Vite or static serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
