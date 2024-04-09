### Follow these steps to get started with federated SQL query against AWS RDS Aurora (MySQL Compatible).

**Step 1.** Navigate to your AWS RDS Aurora instance in the AWS Management Console.

> Note: Ensure that inbound connections are enabled in the associated security group.

**Step 2.** Look for "Reader" endpoint name and port.

![Screenshot](./aws-rds-aurora-mysql.png)

**Step 3.** Depending on chosen credentials management option (AWS Secrets Manager, or Self managed) retrieve `username` and `password`. 

**Step 4.** Edit the `spicepod.yaml` file in this directory and replace `[remote_table_path]` with the path to the remote table to be accelerated, `[local_table_name]` with your desired name for the locally accelerated table, and the `[mysql_host]` and `[mysql_port]` params with the connection parameters from your AWS RDS instance. The `[mysql_user]` and `[mysql_pass]` should be set to the username and password for the RDS instance. The `[mysql_db]` should be set to the name of the database in the RDS instance.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [MySQL Data Connector](https://docs.spiceai.org/data-connectors/mysql) for more options on configuring a MySQL Data Connector.

To securely store your RDS password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 5.** Run the Spice runtime with `spice run` from this directory.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice runtime.

**Step 6.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 7.** Execute the query `select * from [local_table_name];` to see the AWS RDS table accelerated locally.
