# Quickstart: Searching with Spice

## Prerequistes 
 - Ensure you have the Spice CLI installed. Follow the [Spice installation guide](link_to_installation_guide) if you haven't done so.
 - Populate `.env`.

### SQL Search
1. Execute a Basic SQL Query to perform keyword searches within your dataset:
```shell
spice sql
```

Then:
```sql
SELECT path
FROM spiceai.files
WHERE
    LOWER(content) LIKE '%errors%'
    AND NOT contains(path, 'docs/release_notes')
```

### Utilizing Vector-Based Search

1. In the `spicepod.yaml`, uncomment the `datasets[0].embeddings`.
2. Restart the spiced.
3. Perform a basic search
```shell
  curl -XPOST http://localhost:8090/v1/search \
    -H "Content-Type: application/json" \
    -d "{
      \"datasets\": [\"spiceai.files\"],
      \"text\": \"testing\",
      \"where\": \"not contains(path, 'docs/release_notes')\",
      \"additional_columns\": [\"download_url\"],
      \"limit\": 2
    }"
```

### Additional Configuration - Chunking

1. Update the spicepod `datasets[0].embeddings.chunking.enabled: true`.
2. Restart the spiced.
3. Rerun the search
```shell
curlie -XPOST http://localhost:8090/v1/search \
  -H 'Content-Type: application/json' \
  -d "{
    \"datasets\": [\"spiceai.files\"],
    \"text\": \"errors\",
    \"where\": \"not contains(path, 'docs/release_notes')\",
    \"additional_columns\": [\"download_url\"],
    \"limit\": 2
  }"
```

4. Rerun the search, and retrieve the full document (as an entry in `additional_coluumns`).
```shell
 curlie -XPOST http://localhost:8090/v1/search \
  -H 'Content-Type: application/json' \
  -d "{
    \"datasets\": [\"spiceai.files\"],
    \"text\": \"errors\",
    \"where\": \"not contains(path, 'docs/release_notes')\",
    \"additional_columns\": [\"download_url\" , \"content\"],
    \"limit\": 2
  }"
```