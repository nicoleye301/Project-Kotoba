import Http from "@/utils/http";

export async function getAiSuggestedReplies(text: string): Promise<string[]> {
    const suggestions = await Http.post("/nlp/suggestAiReplies", { text });
    return suggestions;
}

export default { getAiSuggestedReplies };
