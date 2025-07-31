import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transcriptText } = await request.json();

    if (!transcriptText) {
      return NextResponse.json(
        { error: "Transcript text is required" },
        { status: 400 }
      );
    }

    console.log("📡 Processing clinical transcript with Gemini:", transcriptText.substring(0, 100) + "...");

    // Generate improved transcript and summary using Gemini
    const result = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a clinical documentation assistant. Please analyze the following dental/medical transcript and provide two separate outputs:

TRANSCRIPT TEXT TO ANALYZE:
"${transcriptText}"

Please provide your response in the following JSON format:
{
  "cleanedTranscript": "corrected conversational transcript",
  "clinicalSummary": "professional clinical summary in plain text format"
}

SPECIFIC REQUIREMENTS:

For cleanedTranscript:
- Fix spelling errors, grammar issues, and remove duplicate phrases
- Identify who is speaking (Doctor vs Patient) and format as a chat conversation
- Use "Doctor:" and "Patient:" labels for each speaker
- Keep the conversational flow and dialogue format
- Clean up stutters and repetitions
- Format like: "Doctor: How are you feeling today?\\nPatient: I've been having some pain..."

For clinicalSummary:
- Create a professional clinical summary as PLAIN TEXT (not JSON structure)
- Format as readable text with clear section headers
- Use this exact format:

CC:
[Chief complaint details]

HPI:
[History of present illness details]

ROS:
[Review of systems details]

Physical Examination:
[Examination findings]

Assessment:
[Clinical assessment with numbered points if multiple conditions]

Plan:
[Treatment plan with numbered steps]

Additional Information Needed:
[Any missing information that would be helpful]

- Use proper medical terminology and abbreviations
- Extract key clinical findings from the conversation
- If insufficient information, note what additional details would be helpful
- Return the summary as plain formatted text, NOT as a JSON object

Return valid JSON with the cleanedTranscript and clinicalSummary as string values.`,
      maxTokens: 1500,
    });

    console.log("✅ Gemini processing completed");

    // Try to parse the JSON response from Gemini
    let parsedResult;
    try {
      // First attempt: direct JSON parse
      parsedResult = JSON.parse(result.text);
    } catch {
      console.warn("⚠️ Could not parse Gemini JSON response, attempting to extract JSON...");
      
      // Second attempt: extract JSON from text that might have extra content
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResult = JSON.parse(jsonMatch[0]);
          console.log("✅ Successfully extracted JSON from response");
        } catch {
          console.warn("⚠️ Could not extract JSON, using fallback format");
          parsedResult = {
            cleanedTranscript: transcriptText,
            clinicalSummary: result.text.replace(/```json\s*|\s*```/g, '').trim()
          };
        }
      } else {
        // Fallback: treat the entire response as summary
        console.warn("⚠️ No JSON found, using entire response as summary");
        parsedResult = {
          cleanedTranscript: transcriptText,
          clinicalSummary: result.text.replace(/```json\s*|\s*```/g, '').trim()
        };
      }
    }

    // Ensure clinicalSummary is always a well-formatted string
    let formattedSummary = parsedResult.clinicalSummary || result.text;
    
    if (typeof formattedSummary === 'object' && formattedSummary !== null) {
      console.log("🔄 Converting structured object to formatted text");
      
      // Convert structured object to properly formatted clinical text
      const sections: string[] = [];
      
      // Handle common medical section names
      const sectionOrder = ['CC', 'HPI', 'ROS', 'Physical Examination', 'Assessment', 'Plan', 'Additional Information Needed'];
      
      // Add sections in preferred order
      sectionOrder.forEach(sectionName => {
        const summaryObj = formattedSummary as Record<string, unknown>;
        const value = summaryObj[sectionName] || summaryObj[sectionName.toLowerCase()] || 
                     summaryObj[sectionName.replace(/\s+/g, '')] || summaryObj[sectionName.replace(/\s+/g, '').toLowerCase()];
        
        if (value && typeof value === 'string') {
          sections.push(`${sectionName}:\n${value}\n`);
        }
      });
      
      // Add any remaining sections not in the standard order
      Object.entries(formattedSummary as Record<string, unknown>).forEach(([key, value]) => {
        if (!sectionOrder.some(section => 
          key === section || key === section.toLowerCase() || 
          key === section.replace(/\s+/g, '') || key === section.replace(/\s+/g, '').toLowerCase()
        )) {
          if (typeof value === 'string') {
            sections.push(`${key}:\n${value}\n`);
          }
        }
      });
      
      formattedSummary = sections.join('\n');
      console.log("✅ Successfully converted to formatted clinical text");
    }
    
    // Clean up any remaining JSON artifacts or markdown
    if (typeof formattedSummary === 'string') {
      formattedSummary = formattedSummary
        .replace(/```json\s*|\s*```/g, '')
        .replace(/^"/, '').replace(/"$/, '') // Remove surrounding quotes
        .replace(/\\n/g, '\n') // Convert escaped newlines
        .trim();
    }

    return NextResponse.json({
      success: true,
      cleanedTranscript: parsedResult.cleanedTranscript || transcriptText,
      clinicalSummary: formattedSummary,
      originalTranscript: transcriptText,
      processedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Error processing clinical summary:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process clinical summary",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 