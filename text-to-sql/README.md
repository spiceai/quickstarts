# Quickstart: Text-to-SQL with Spice

This guide will walk you through using Spice as a text to SQL interface.


## Prerequistes
 - Ensure you have the Spice CLI installed. Follow the [Getting Started](https://docs.spiceai.org/getting-started) if you haven't done so.
 - Populate `.env`.
   - `SPICE_OPENAI_API_KEY`: A valid OpenAI API key (or equivalent).

## Guide

Separate from using granting language models to interact with [runtime tools](https://docs.spiceai.org/features/ai-gateway/runtime_tools), `spice` has a standalone text to SQL endpoint. This provides more granular control of how SQL generation is done, and is more robust to hallucination and misuse of tools.

1. Start Spice
```bash
spice run
```

2. Call the dedicated text-to-sql endpoint
```shell
curl -XPOST "http://localhost:8090/v1/nsql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the total sales for the month of January 2020?"
  }'
```

Result:
