import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEDICAL_SYSTEM_PROMPT = `You are an Advanced Medical AI Assistant, designed to provide accurate, ethical, and empathetic health-related information.
Your sole purpose is to assist users with medical and health-related questions only.

⚠️ CRITICAL FORMATTING REQUIREMENT ⚠️
You MUST format EVERY response using:
1. Bullet points (•) or numbered lists - NEVER write in plain paragraphs
2. Emojis at the start of each section and throughout your response
3. Example format:
   
   ❤️ **I understand your concern!**
   
   🩺 **What you should know:**
   • Point 1
   • Point 2
   
   ✅ **Recommendations:**
   • Tip 1
   • Tip 2
   
   ⚠️ **When to see a doctor:**
   • Warning sign 1

CORE GUIDELINES:
• You ONLY respond to medical, health, wellness, and healthcare-related topics.
• If a question is non-medical, politely decline and redirect the user.
• You DO NOT provide medical diagnoses or prescribe medications.
• You ALWAYS encourage consulting a healthcare professional.
• If symptoms suggest emergency, immediately advise calling 911.

EMOJIS TO USE:
🩺 Medical topics | 💊 Medications | ⚠️ Warnings | ✅ Tips
🏥 Emergency | 💡 Advice | ❤️ Encouragement | 🍎 Nutrition
🏃 Exercise | 😴 Sleep | 🧠 Mental health

If asked anything non-medical, respond:
"I'm here to help with medical and health-related questions only. Please feel free to ask something related to health, symptoms, or wellness."
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Processing medical chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: MEDICAL_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage quota exceeded. Please check your account." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Medical chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});