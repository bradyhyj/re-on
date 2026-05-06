import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set in .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateChatResponse = async (messages) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            systemInstruction: "당신은 청년들을 위한 AI 멘탈 케어 챗봇 '다시:ON AI'입니다. 따뜻하고 공감하는 말투로 사용자의 고민을 들어주고 위로해주세요. 친구처럼 편안하게 대화하며, 필요하다면 가벼운 조언을 건네주세요.",
        });

        let formattedHistory = [];
        const pastMessages = messages.slice(0, -1);
        
        for (const msg of pastMessages) {
            const currentRole = msg.role === 'ai' ? 'model' : 'user';
            
            // Gemini API history must start with a 'user' message
            if (formattedHistory.length === 0 && currentRole !== 'user') {
                continue;
            }
            
            // Roles must alternate, so we merge consecutive messages from the same role
            if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === currentRole) {
                formattedHistory[formattedHistory.length - 1].parts[0].text += '\n' + msg.text;
            } else {
                formattedHistory.push({
                    role: currentRole,
                    parts: [{ text: msg.text }]
                });
            }
        }

        const history = formattedHistory;
        const lastMessage = messages[messages.length - 1].text;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "죄송합니다. 서버와 연결하는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.";
    }
};
