const MODEL = 'gemini-3.6-flash';
const SYSTEM_INSTRUCTION = 'Bạn là Mầm, trợ lý AI của website Giáo dục môi trường. Hãy trả lời đúng câu hỏi người dùng bằng tiếng Việt, đi thẳng vào nội dung, không viết lời dẫn chung chung, không tự giới thiệu, không thêm lời kết sáo rỗng. Với câu hỏi cần hướng dẫn, hãy đưa 3 đến 5 việc làm cụ thể dưới dạng danh sách ngắn. Với lời chào, hãy chào lại ngắn gọn. Ưu tiên các chủ đề đất, nước, không khí, sinh vật, tái chế và bảo vệ môi trường. Nếu câu hỏi chưa rõ, hãy hỏi lại một câu cụ thể. Nếu ngoài chủ đề, hãy nói ngắn gọn rằng bạn chuyên hỗ trợ giáo dục môi trường.';

module.exports = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: { message: 'Phương thức không được hỗ trợ.' } });
  }

  const contents = request.body?.contents;
  if (!Array.isArray(contents) || contents.length === 0) {
    return response.status(400).json({ error: { message: 'Nội dung câu hỏi không hợp lệ.' } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: { message: 'Chưa cấu hình GEMINI_API_KEY trên Vercel.' } });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
        })
      }
    );

    const data = await geminiResponse.json();
    return response.status(geminiResponse.status).json(data);
  } catch (error) {
    return response.status(502).json({ error: { message: 'Không thể kết nối với Gemini.' } });
  }
};