# Real-time Web Search Integration

The Global Chat can enrich answers with live web results using Google Custom Search (CSE).

Environment variables:
- GOOGLE_SEARCH_API_KEY – Google API key
- GOOGLE_SEARCH_CX – Custom Search Engine ID

How it works:
1. `webSearch(query)` fetches top results from Google CSE.
2. Results are added to the prompt for Gemini in `aiUtils.generateGlobalResponse()`.
3. The API route `/api/chat/global` returns structured response plus `webResults`.
4. The chat UI renders top results with links and shows a clean Sources section.

Disable or tune:
- In the POST body to `/api/chat/global`, set `enableWebSearch: false` to disable.
- Set `maxWebResults` to limit results (1–10).

Limitations:
- Requires valid Google CSE credentials and that your CSE indexes relevant websites.
- If keys are missing or the API fails, it gracefully falls back to model-only answers.

Security:
- Keep API keys in environment variables; do not commit them to source control.
