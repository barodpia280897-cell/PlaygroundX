/**
 * Lightweight client to call Google Gemini API directly from frontend.
 * Uses REST API without needing extra SDKs.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function callGemini(messages, systemPrompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    // Return a helpful mock response if no valid key is set so UI doesn't crash during demo/testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "⚠️ **Gemini API Key Missing**\n\nTo enable real AI responses, please open your `.env` file and add a valid Google Gemini API key:\n\n```env\nVITE_GEMINI_API_KEY=your_actual_api_key_here\n```\n\nYou can get a free API key in 2 minutes from [Google AI Studio](https://aistudio.google.com/app/apikey).\n\n*(In the meantime, I am running in Offline Demo Mode. How can I help you navigate PlayGroundX CRM?)*"
        );
      }, 1000);
    });
  }

  try {
    // Convert openAI/standard message format {role: 'user'|'model', content: ''} to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return reply || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `❌ **Error communicating with AI:** ${error.message}. Please check your API key and network connection.`;
  }
}
