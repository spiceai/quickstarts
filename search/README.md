
# Quickstart: Utilizing Search Capabilities in Spice

In this quickstart, we'll guide you through how to harness both SQL-Based and Vector Search functionalities within Spice to explore datasets effectively.

## Introduction to Search in Spice

**Spice** offers sophisticated search capabilities that transcend conventional SQL queries, featuring both database-native SQL search methods and advanced vector-based search capabilities. This quickstart will guide you through both approaches, demonstrating how you can efficiently find the information you need.

---

## Exploring SQL-Based Search

Spice supports traditional SQL query patterns, allowing users to execute straightforward text searches across a dataset using SQL's `LIKE` clause. Below is an example:

### Getting Started with SQL Search

1. **Basic Pattern Search**
   ```sql
   SELECT id, text_column
   FROM my_table
   WHERE
       LOWER(text_column) LIKE '%search_term%'
     AND
       date_published > '2021-01-01'
   ```
   Use the above query for simple keyword searches within your dataset.

## Leveraging Vector-Based Search

### Advanced Vector Search with Spice

Beyond SQL, Spice offers advanced vector-based search functionality. This feature supports:

- **Local Embedding Models**, e.g., [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2).
- **Remote Embedding Providers**, e.g., [OpenAI](https://platform.openai.com/docs/api-reference/embeddings/create).

### Configuring Vector Search

1. **Defining Your Embeddings**:
   Embeddings are configured within the `spicepod.yaml` file:

   ```yaml
   embeddings:
     - from: openai
       name: remote_service
       params:
         openai_api_key: ${ secrets:SPICE_OPENAI_API_KEY }

     - name: local_embedding_model
       from: huggingface:huggingface.co/sentence-transformers/all-MiniLM-L6-v2
   ```

2. **Augmenting Datasets with Embeddings**:
   To perform similarity searches:

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
   This setup targets the `body` column of the dataset for embedding, allowing nuanced search capabilities.

3. **Executing a Search Query**:
   Use curl to perform a vector-based search:

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

### Additional Features

**Chunking Support**: Spice supports chunking large text columns, ensuring only relevant text portions are retrieved during searches.

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

**Document Retrieval**: Retrieve full content by including the embedding column in `additional_columns` when using vector-based search.

### Conclusion

Welcome to the new world of searching with Spice, combining traditional SQL with cutting-edge vector search. For full API details, refer to the [API reference for /v1/search](/api/http/search).

---

This quickstart guide simplifies both SQL-based and vector-based search functionalities offered in Spice, enabling users to make the most of these advanced features.

chat> {form a self critic of the above made quickstart. One thing I notice, is that a user cannot run the quickstart because it doesn't know what spicepods to run, and doesn't specify what/how to get the datasets
Here's a self-critique of the provided quickstart guide, identifying some key areas for improvement:

1. **Lack of Dataset Initialization Instructions:**
   - **Issue:** The quickstart doesn't specify how to set up or access the datasets in Spice. Users need explicit instructions on loading or creating datasets.
   - **Improvement:** Provide steps to access or create the `spiceai.issues` dataset or any relevant data sources necessary for running the examples.
   - **Suggestion:** Include a section on setting up a sample dataset, linking directly to any required datasets or providing the necessary SQLCreate statements.

2. **Missing Spicepod Configuration:**
   - **Issue:** The guide assumes users have a configured spicepod, which may not be the case for everyone.
   - **Improvement:** Detail how to configure or initialize a spicepod, including setting up any necessary credentials or secrets (e.g., OpenAI API Key).
   - **Suggestion:** Add configuration steps to set up spicepod.yml, including examples or templates that users can customize.

3. **No Step-by-Step Execution Guide:**
   - **Issue:** Users might find it difficult to follow along without clear, ordered steps.
   - **Improvement:** Break down instructions into clear, actionable steps.
   - **Suggestion:** Use numbered steps and include explanatory notes for sections like embedding configuration and query execution.

4. **Assumed Prior Knowledge:**
   - **Issue:** There are assumptions about the reader’s familiarity with Spice and its configuration.
   - **Improvement:** Introduce brief explanations of what Spice is and basic concepts.
   - **Suggestion:** Start with an introductory section on how Spice fits into a search workflow, including a glossary of terms or direct links to documentation.

5. **Lack of Practical Execution Tips:**
   - **Issue:** Users are not instructed on how to execute the scripts or what environment setups are required.
   - **Improvement:** Detail how to run shell commands and which environments are supported.
   - **Suggestion:** Include basic tips on setting up a local environment to run the command-line examples, such as necessary installations and environment variables.

6. **Formatting and Readability:**
   - **Issue:** The guide could benefit from improved formatting for ease of reading and comprehension.
   - **Improvement:** Organize content into distinct sections with headings, and use bullet points for lists.
   - **Suggestion:** Use code blocks for commands and configurations for better readability.

---

By addressing these areas, the quickstart guide will be more comprehensive and user-friendly, ensuring that users can effectively harness Spice's search capabilities from the very start.

chat> Taking your and my feedback on board, rewrite the quickstart for search
Here's a revised version of the quickstart guide incorporating both your and my feedback to provide a more comprehensive and user-friendly introduction to using search functionalities in Spice:

---

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

---

## Conclusion

With this guide, you should be well-equipped to utilize both SQL-based and vector-based search functionalities in Spice. For more details on the capabilities of Spice, visit the [Spice Documentation](link_to_docs).
