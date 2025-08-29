// Define stop sequences for different types of analysis
export const STOP_SEQUENCES = {
  // For general article analysis
  ANALYSIS: [
    "END_ANALYSIS",
    "CONCLUSION:",
    "###",
    "[End of Analysis]"
  ],

  // For step-by-step reasoning
  CHAIN_OF_THOUGHT: [
    "Therefore,",
    "In conclusion,",
    "Final thoughts:",
    "END_REASONING"
  ],

  // For fact-checking
  FACT_CHECK: [
    "Verification complete.",
    "END_FACT_CHECK",
    "Sources:"
  ],

  // For summarization
  SUMMARY: [
    "END_SUMMARY",
    "In brief:",
    "TL;DR:"
  ]
}

export interface AICallOptions {
  stopSequences?: string[]
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
}

// Helper function to get appropriate stop sequences based on analysis type
export function getStopSequences(analysisType: keyof typeof STOP_SEQUENCES): string[] {
  return STOP_SEQUENCES[analysisType] || STOP_SEQUENCES.ANALYSIS
}
