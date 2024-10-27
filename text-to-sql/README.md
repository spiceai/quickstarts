# Quickstart: Text-to-SQL with Spice

This guide will walk you through using Spice as a text to SQL interface.


## Prerequistes
 - Ensure you have the Spice CLI installed. Follow the [Getting Started](https://docs.spiceai.org/getting-started) if you haven't done so.
 - Populate `.env`.
   - `SPICE_OPENAI_API_KEY`: A valid OpenAI API key (or equivalent).
 - Install `jq` from [here](https://jqlang.github.io/jq/download/)
   - Or `brew install jq` for MacOS.
   - Or `sudo apt-get install jq` for Linux.

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
```json
[
    {
        "total_rides": 2964624
    }
]
```

3. Inspect the tools used.
```shell
curl -X POST "http://localhost:8090/v1/sql" \
  --data "
    SELECT input
    FROM runtime.task_history
    WHERE trace_id = (
      SELECT trace_id
      FROM runtime.task_history
      WHERE task = 'nsql'
      LIMIT 1
    )
    AND task = 'ai_completion';
  " \
  | jq -cr '.[0].input' \
  | jq '.'
```

Result:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "```SQL\nCREATE TABLE IF NOT EXISTS \"spice.public.taxi_trips\" ( \"VendorID\" integer, \"tpep_pickup_datetime\" timestamp, \"tpep_dropoff_datetime\" timestamp, \"passenger_count\" bigint, \"trip_distance\" double precision, \"RatecodeID\" bigint, \"store_and_fwd_flag\" text, \"PULocationID\" integer, \"DOLocationID\" integer, \"payment_type\" bigint, \"fare_amount\" double precision, \"extra\" double precision, \"mta_tax\" double precision, \"tip_amount\" double precision, \"tolls_amount\" double precision, \"improvement_surcharge\" double precision, \"total_amount\" double precision, \"congestion_surcharge\" double precision, \"Airport_fee\" double precision )```\nTask: Write a postgres SQL query to answer this question: _\"How many taxi rides have been made?\"_. Instruction: Return only valid SQL code, nothing additional."
    },
    {
      "role": "assistant",
      "tool_calls": [
        {
          "id": "distinct-spice.public.taxi_trips-nsql",
          "type": "function",
          "function": {
            "name": "sample_data",
            "arguments": "{\"dataset\":\"spice.public.taxi_trips\",\"limit\":3,\"cols\":null}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "content": "\"+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\\n| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |\\n+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\\n| 1        | 2002-12-31T22:59:39  | 2002-12-31T23:05:41   | 0               | 0.0           | 1          | N                  | 1            | 1            | 0            | -899.0      | -7.5  | -0.5    | -80.0      | -80.0        | -1.0                  | -900.0       | -2.5                 | -1.75       |\\n| 2        | 2009-01-01T00:24:09  | 2009-01-01T01:13:00   | 1               | 0.01          | 2          | Y                  | 2            | 2            | 1            | -800.0      | -6.0  | 0.0     | -66.02     | -60.0        | -0.3                  | -801.0       | -0.75                | 0.0         |\\n| 6        | 2009-01-01T23:30:39  | 2009-01-02T00:01:39   | 2               | 0.02          | 3          |                    | 3            | 3            | 2            | -744.3      | -5.0  | 0.5     | -65.1      | -56.64       | 0.0                   | -753.74      | 0.0                  | 1.75        |\\n+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\"",
      "tool_call_id": "distinct-spice.public.taxi_trips-nsql"
    },
    {
      "role": "assistant",
      "tool_calls": [
        {
          "id": "distinct-spice.public.taxi_trips-nsql",
          "type": "function",
          "function": {
            "name": "sample_data",
            "arguments": "{\"dataset\":\"spice.public.taxi_trips\",\"limit\":3}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "content": "\"+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\\n| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |\\n+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\\n| 1        | 2024-01-10T16:22:13  | 2024-01-10T16:27:50   | 1               | 0.6           | 1          | N                  | 142          | 230          | 1            | 6.5         | 5.0   | 0.5     | 3.0        | 0.0          | 1.0                   | 16.0         | 2.5                  | 0.0         |\\n| 1        | 2024-01-10T16:24:01  | 2024-01-10T16:36:51   | 1               | 1.2           | 1          | N                  | 161          | 237          | 1            | 11.4        | 5.0   | 0.5     | 3.6        | 0.0          | 1.0                   | 21.5         | 2.5                  | 0.0         |\\n| 1        | 2024-01-10T16:48:49  | 2024-01-10T16:55:11   | 1               | 1.0           | 1          | N                  | 237          | 75           | 1            | 7.9         | 5.0   | 0.5     | 2.9        | 0.0          | 1.0                   | 17.3         | 2.5                  | 0.0         |\\n+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+\"",
      "tool_call_id": "distinct-spice.public.taxi_trips-nsql"
    }
  ],
  "model": "nql",
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "sql_mode",
      "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "sql": {
            "type": "string"
          }
        },
        "required": [
          "sql"
        ],
        "title": "StructuredNsqlOutput",
        "type": "object"
      },
      "strict": true
    }
  }
}
```

From this, you can see that `spice` does the following to help the model with text to sql:
 - Shows table creation SQL statements for the relevant tables.
 - Sample data from the relevant table(s), both:
    - A sample of the data in the table.
    - A sample of disctinct values from each column in the table.


### Disable Sampling
To disable sampling in text-to-SQL:
```shell
curl -XPOST "http://localhost:8090/v1/nsql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the total sales for the month of January 2020?",
     "sample_data_enabled": false
  }'
```

### Specify Tables
To restrict the tables that `spice` uses for text-to-SQL:
```shell
curl -XPOST "http://localhost:8090/v1/nsql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the total sales for the month of January 2020?",
    "tables": ["public.sales"]
  }'
```
