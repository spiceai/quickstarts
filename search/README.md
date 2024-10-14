# Quickstart: Mastering Search in Spice

Welcome to this quickstart guide! Here, you'll learn how to use Spice's powerful search capabilities, combining both SQL-based and advanced vector-based search functionalities. Whether you're new or experienced, follow these steps to get started and unlock the full potential of your data.

## Introduction to Searching with Spice

**Spice** integrates traditional SQL and cutting-edge vector-based search technologies to empower users with flexible and efficient data exploration.

---

## Getting Started

### Setting Up Your Environment

1. **Install Spice:**
   - Ensure you have the Spice CLI installed. Follow the [Spice installation guide](link_to_installation_guide) if you haven't done so.

2. **Create a New Spice Pod:**
   - Initialize a new spicepod to organize your datasets and configurations:
     ```bash
     spice create my_first_spicepod
     cd my_first_spicepod
     ```

3. **Configure Your Spicepod:**
   - Edit the `spicepod.yaml` configuration file:
     ```yaml
     embeddings:
       - from: openai
         name: remote_service
         params:
           openai_api_key: ${ secrets:SPICE_OPENAI_API_KEY }

       - name: local_embedding_model
         from: huggingface:huggingface.co/sentence-transformers/all-MiniLM-L6-v2
     ```

4. **Load Sample Datasets:**
   - Add datasets to your Spice pod. For an example, creating a dataset from GitHub issues:
     ```yaml
     datasets:
       - from: github:github.com/spiceai/spiceai/issues
         name: spiceai.issues
         acceleration:
           enabled: true
         embeddings:
           - column: body
             use: local_embedding_model
     ```

### **Ensure API Keys Are Set:**
   - Export or set necessary environment variables before proceeding (e.g., `SPICE_OPENAI_API_KEY`).

---

## Performing SQL-Based Search

Spice allows you to perform traditional SQL searches efficiently:

### Execute a Basic SQL Query

1. **Run a Query:**
   - Use SQL to perform keyword searches within your dataset:
     ```sql
     SELECT id, text_column
     FROM spice.public.quickstarts
     WHERE
         LOWER(text_column) LIKE '%search_term%'
       AND
         date_published > '2021-01-01'
     ```

Run this via your SQL interface connected to Spice.

---

## Utilizing Vector-Based Search

Vector-based search in Spice enables semantic and similarity-based searches, enhancing your search capabilities beyond traditional keywords.

### Configure Vector Search

1. **Embedding Configuration:**
   - Make sure your dataset column is configured for vector search in your `spicepod.yaml`.

2. **Perform a Search Query:**
   - Execute a vector-based query using curl from the command line:
     ```shell
     curl -XPOST http://localhost:8090/v1/search \\
       -H 'Content-Type: application/json' \\
       -d '{
         "datasets": ["spiceai.issues"],
         "text": "cutting edge AI",
         "where": "author=\"jeadie\"",
         "additional_columns": ["title", "state"],
         "limit": 2
       }'
     ```

This command returns results based on semantic similarities in your data.

### Additional Configuration - Chunking

- Spice supports chunking large text fields for more precise searches.

Example configuration:
```yaml
datasets:
  - ...
    embeddings:
      - column: body
        use: local_embedding_model
        chunking:
          enabled: true
          target_chunk_size: 512
```