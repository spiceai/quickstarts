# FTP/SFTP Data Connector

Follow these steps to get started with FTP/SFTP as a Data Connector.

**Step 1** Edit the `spicepod_ftp.yaml` or `spicepod_sftp.yaml` file in this directory, depending on your chosen connection type. Replace the parameters in the specified dataset with the connection details for your FTP/SFTP server. Define `[local_table_name]` as your preferred name for the federated table, `[remote_host]` as the server's address, and `[remote_path]` as the directory or file you wish to accelerate. The file should be named simply as spicepod.yaml. Currently, FTP/SFTP supports Parquet and CSV file formats.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

To securely store your FTP/SFTP password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from [local_table_name];` to see the data from your Parquet or CSV files from remote FTP/SFTP server accelerated locally.

