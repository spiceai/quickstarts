## LLM Memory Quickstarts

Spice can provide persistent memory capabilities for language models, allowing them to remember important details from conversations across sessions.

## Requirements

- [Spice CLI](https://docs.spiceai.org/getting-started) installed.
- The following environment variables set:
  - `SPICE_OPENAI_API_KEY`
---

## Using LLM Memory

**Step 1.** Run Spice runtime
```shell
spice run
```

**Step 3.** Start a chat session
```shell
spice chat
```

**Step 4.** Interact with the model
```shell
>>> spice chat
Welcome to the Spice.ai Chat!
Using model: chat_model

chat> Hi, my name is Alice and I work as a software engineer
Hello Alice! Nice to meet you. It's great to connect with a fellow software engineer. How's your day going?

chat> I live in Seattle
I see you're based in Seattle! That's a great tech hub. How do you like living there?
```

**Step 5.** Check stored memories
```shell
spice sql
```

Then:
```sql
SELECT id, value FROM llm_memory;
```
```shell
+--------------------------------------+----------------------------------------+
| id                                   | value                                  |
+--------------------------------------+----------------------------------------+
| 01930a3e-65aa-7332-b401-c112f7f72b70 | User's name is Alice.                 |
| 01930a3e-65aa-7332-b401-c127c51b2c67 | Alice works as a software engineer.   |
| 01930a3e-65aa-7332-b401-c1394d0e6025 | Alice lives in Seattle.               |
+--------------------------------------+----------------------------------------+
```

### Using Memory Tools Directly
**Step 1.** Store a memory directly
```shell
curl -XPOST http://127.0.0.1:8090/v1/tool/store_memory -d '{"thoughts": ["Alice deserves a promotion"]}'
```

**Step 2.** Load stored memories
```shell
curl -XPOST http://127.0.0.1:8090/v1/tool/load_memory -d '{"last": "10m"}'
```
