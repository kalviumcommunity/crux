// A simple tokenizer function (approximate token count)
export const countTokens = (text: string): number => {
  // This is a simple approximation. For more accurate counts, you might want to use a proper tokenizer
  // Gemini typically uses about 4 characters per token on average
  return Math.ceil(text.length / 4);
};

// Function to log token usage
export const logTokenUsage = (
  prompt: string,
  response: string,
  context: string = ""
): void => {
  const promptTokens = countTokens(prompt);
  const responseTokens = countTokens(response);
  const contextTokens = countTokens(context);
  const totalTokens = promptTokens + responseTokens + contextTokens;

  console.log("\n=== Token Usage Report ===");
  console.log(`Prompt Tokens: ${promptTokens}`);
  console.log(`Response Tokens: ${responseTokens}`);
  if (context) {
    console.log(`Context Tokens: ${contextTokens}`);
  }
  console.log(`Total Tokens: ${totalTokens}`);
  console.log("========================\n");
};
