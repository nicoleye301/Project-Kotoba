import Http from "@/utils/http";

export async function getAiSuggestedReplies(text: string): Promise<string[]> {
    const suggestions = await Http.post("/nlp/suggestAiReplies", { text });
    return suggestions;
}
export async function analyzeMessage(text: string): Promise<string[]> {
    const analysis = await Http.post("/nlp/analyzeMessage", { text });
    return analysis;
}

export default { getAiSuggestedReplies, analyzeMessage,};
