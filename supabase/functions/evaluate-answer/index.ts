import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, modelAnswer, studentAnswer, maxMarks, scoringFormula } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use custom formula if provided, otherwise use default
    const weights = scoringFormula?.useCustom
      ? scoringFormula.weights
      : { keywords: 30, semantic: 40, diagram: 20, grammar: 10 };

    // Convert percentages to decimals
    const kw = weights.keywords / 100;
    const sem = weights.semantic / 100;
    const dia = weights.diagram / 100;
    const gram = weights.grammar / 100;

    const systemPrompt = `You are an expert academic grading assistant. Evaluate student answers against model answers using this exact scoring formula:

SCORING BREAKDOWN (for max marks = ${maxMarks}):
1. Keyword Matching (${weights.keywords}%): Compare key terms/concepts between student and model answer
2. Semantic Similarity (${weights.semantic}%): Assess overall meaning and understanding  
3. Diagram Evaluation (${weights.diagram}%): If diagrams are mentioned/required, check if student included them
4. Grammar Penalty (${weights.grammar}%): Deduct for grammar, spelling, clarity issues

IMPORTANT: 
- Final score MUST be between 0 and ${maxMarks}
- Be fair but rigorous
- Provide constructive feedback

Respond in this exact JSON format:
{
  "keywordScore": <number 0 to ${maxMarks * kw}>,
  "semanticScore": <number 0 to ${maxMarks * sem}>,
  "diagramScore": <number 0 to ${maxMarks * dia}>,
  "grammarPenalty": <number 0 to ${maxMarks * gram}>,
  "finalScore": <number 0 to ${maxMarks}>,
  "feedback": "<detailed feedback on the answer>",
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}`;

    const userPrompt = `QUESTION:
${question}

MODEL ANSWER (Expected):
${modelAnswer}

STUDENT ANSWER (To Evaluate):
${studentAnswer}

Evaluate the student answer and provide scores in the specified JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI evaluation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from the AI
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/```\s*([\s\S]*?)\s*```/) ||
        [null, content];
      const jsonString = jsonMatch[1] || content;
      result = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback response
      result = {
        keywordScore: maxMarks * 0.15,
        semanticScore: maxMarks * 0.2,
        diagramScore: 0,
        grammarPenalty: maxMarks * 0.02,
        finalScore: maxMarks * 0.33,
        feedback: "Unable to fully evaluate. The answer shows some understanding but needs improvement.",
        improvements: [
          "Provide more specific details",
          "Include key terminology from the question",
          "Structure your answer more clearly"
        ],
      };
    }

    // Ensure scores are within bounds using dynamic weights
    result.keywordScore = Math.min(maxMarks * kw, Math.max(0, result.keywordScore || 0));
    result.semanticScore = Math.min(maxMarks * sem, Math.max(0, result.semanticScore || 0));
    result.diagramScore = Math.min(maxMarks * dia, Math.max(0, result.diagramScore || 0));
    result.grammarPenalty = Math.min(maxMarks * gram, Math.max(0, result.grammarPenalty || 0));
    result.finalScore = Math.min(
      maxMarks,
      Math.max(0, result.keywordScore + result.semanticScore + result.diagramScore - result.grammarPenalty)
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Evaluation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
