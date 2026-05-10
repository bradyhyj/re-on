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

export const analyzePortfolioFile = async (base64Data, mimeType) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            systemInstruction: `당신은 IT/취업 전문 AI 컨설턴트입니다. 사용자의 포트폴리오/이력서를 분석하여 구직 준비도 및 세부 실무 역량을 수치화하세요.
만약 첨부된 파일이 포트폴리오나 이력서와 무관한 내용이라면 isValidPortfolio를 false로 설정하세요. 그 외에는 true로 설정하세요.
반드시 아래 JSON 형식으로만 응답해야 합니다. 마크다운 백틱(\`\`\`) 없이 순수 JSON 문자열만 반환하세요.
{
  "isValidPortfolio": true, // 포트폴리오 관련 문서가 아니면 false
  "jobReadinessScore": 8, // 1~9점 사이의 정수 (전반적인 구직 준비도)
  "skillScores": [
    { "label": "기술", "value": 85 },
    { "label": "경험", "value": 75 },
    { "label": "소통", "value": 80 },
    { "label": "자격", "value": 70 },
    { "label": "직무이해", "value": 85 }
  ] // 각 value는 1~100점 사이의 정수
}`,
        });

        // Remove data URI prefix (e.g. data:application/pdf;base64,) if present
        const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

        const prompt = "첨부된 포트폴리오를 분석하여 점수를 매겨주세요.";
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Content,
                    mimeType: mimeType || 'application/pdf'
                }
            }
        ]);
        
        let responseText = result.response.text();
        
        // Clean up markdown code blocks if any
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini API Error (Portfolio):", error);
        // Fallback simulated data on error
        return {
            isValidPortfolio: false,
            jobReadinessScore: 7,
            skillScores: [
                { label: '기술', value: 70 },
                { label: '경험', value: 65 },
                { label: '소통', value: 75 },
                { label: '자격', value: 60 },
                { label: '직무이해', value: 80 }
            ]
        };
    }
};

export const generateSkillRecommendations = async (radarData, careerFields, portfolioStatus = 'valid') => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            systemInstruction: `당신은 대구 청년 취업/커리어 전문 AI 컨설턴트입니다. 사용자의 직무 역량(0~100점)과 지망 직무를 바탕으로 맞춤형 보강 역량, 교육 추천, 퀘스트를 JSON 형식으로 제안하세요.
반드시 마크다운 백틱(\`\`\`) 없이 순수 JSON 문자열만 반환하세요.
{
  "weakPoints": [
    { "icon": "이모지(예: ⚛️)", "text": "구체적인 부족 역량 설명 (예: 프레임워크 숙련도 부족)", "level": "높음/중간/낮음" }
  ], // 2개 추천
  "recommendations": [
    { "type": "국비지원/온라인/유료/무료", "title": "교육 과정명", "org": "주관 기관", "tag": "태그명 · 기간", "free": true/false }
  ], // 3개 추천
  "quests": [
    {
      "id": 1,
      "title": "퀘스트 제목 (예: 국민내일배움카드 발급)",
      "status": "current/locked",
      "desc": "구체적인 퀘스트 설명",
      "weeklyGoals": [
        { "week": "이번 주", "task": "할 일" },
        { "week": "다음 주", "task": "할 일" }
      ] // 주차별 목표 (선택사항, 최대 2주)
    }
  ] // 3~4개 퀘스트 (1~2개는 current, 나머지는 locked. 처음부터 done 상태인 퀘스트는 절대 만들지 마세요.)
}`,
        });

        const statusMsg = portfolioStatus === 'invalid' ? '사용자가 올바르지 않은 포트폴리오를 업로드했습니다. 사용자의 현재 역량 수치는 임의로 부여된 것입니다. 선택한 지망 직무의 일반적이고 표준적인 로드맵과 보강해야 할 역량을 제시해주세요.' 
            : portfolioStatus === 'none' ? '사용자가 포트폴리오를 업로드하지 않았습니다. 사용자의 현재 역량 수치는 임의로 부여된 것입니다. 선택한 지망 직무의 일반적이고 표준적인 로드맵과 보강해야 할 역량을 제시해주세요.'
            : '사용자가 유효한 포트폴리오를 업로드했습니다. 분석된 사용자의 역량 수치를 바탕으로 맞춤형 보강 역량과 로드맵을 제시해주세요.';

        const prompt = `
사용자 지망 직무: ${careerFields?.join(', ') || '미설정'}
사용자 현재 역량 수치 (0~100점):
${radarData.map(d => `${d.label}: ${d.value}점`).join('\n')}

참고사항: ${statusMsg}

위 데이터를 바탕으로 가장 점수가 낮은 역량을 중심으로 분석하여 보강이 필요한 점, 맞춤 교육 로드맵, 그리고 당장 실천할 수 있는 퀘스트 현황을 JSON으로 만들어주세요.`;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini API Error (Skill Recommendations):", error);
        // Fallback simulated data on error
        return {
            weakPoints: [
                { icon: '⚠️', text: '일시적인 서버 통신 장애가 있습니다.', level: '높음' }
            ],
            recommendations: [
                { type: '온라인', title: '청년 취업 역량 강화 워크숍', org: '대구광역시', tag: '공통 역량 · 2주', free: true }
            ],
            quests: [
                { id: 1, title: '페이지 새로고침', status: 'current', desc: '네트워크 연결을 확인하고 다시 시도해주세요.', weeklyGoals: [] }
            ]
        };
    }
};
