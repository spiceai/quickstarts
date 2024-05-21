# FTP/SFTP Data Connector

## Requirements

- Docker

## Follow these steps to get started with FTP/SFTP as a Data Connector.

**Step 1.** Start a local FTP server preloaded with demo csv data via Docker Compose.

```bash
make
```

**Step 2.** Start the Spice runtime.

```bash
spice run
```

**Step 3.** Start the Spice SQL REPL and perform the following SQL queries:

```bash
spice sql
```

```sql
-- Query data from loaded customers.csv
select * from customers;
```

**Step 4.** Clean up the demo environment:

```bash
make clean
```

[Learn more](https://docs.spiceai.org/data-connectors/ftp) about Spice FTP/SFTP Data Connector.
