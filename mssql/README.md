# Spice Demo with SalesLT dataset in MSSQL

This demo showcases how to use Spice with the SalesLT sample dataset in MSSQL.

## Prerequisites

- MSSQL Server with SalesLT sample dataset
- Spice installed and configured

## Steps
1. Obtain your SQL server ADO connection string. It should look something like this:
    `Server=tcp:server.database.windows.net,1433;Initial Catalog=nrc_health_testing;Persist Security Info=False;User ID={your_username};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`

2. Copy `.env.example` as `.env` and put the connection string in the new `.env` file in the `MSSQL_CONNECTION_STRING` field

3. Put your OpenAI key in the `SPICE_OPENAI_API_KEY` field

3. Run Spice with `spice run`

4. In another shell run `spice sql` to connect to the Spice backend and query your data or `spice chat` to chat with your data using an LLM


```
sql> SELECT COUNT(*) FROM customer
+----------+
| count(*) |
+----------+
| 847      |
+----------+
```

```
❯ spice chat
Using model: openai

chat> How many customers do I have?
You have 847 customers.
```