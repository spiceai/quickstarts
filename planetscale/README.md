# Planetscale Data Connector

Follow these steps to get started with federated SQL query against [Planetscale](https://planetscale.com/).

**Step 1.** Navigate to your Planetscale account and select your database, then click `Connect`.

![Screenshot](./img/planetscale-1-connect.png)

**Step 2.** Select the branch, set the password name, and specify the role. Read-only access will be sufficient for spice.

![Screenshot](./img/planetscale-2-create-password.png)

**Step 3.** Select "Other" for the framework option and copy the generated credentials.

![Screenshot](./img/planetscale-3-configure.png)

**Step 4.** Edit the `spicepod.yaml` file in this directory and replace `[remote_table_path]` with the path to the Planetscale table to be accelerated, `[local_table_name]` with your desired name for the locally accelerated table, and the `[mysql_host]` and `[mysql_port]` params with the connection parameters from your AWS RDS instance. The `[mysql_user]` and `[mysql_pass]` should be set to the username and password for the RDS instance. The `[mysql_db]` should be set to the name of the database in the Planetscale instance.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [MySQL Data Connector](https://docs.spiceai.org/data-connectors/mysql) for more options on configuring a MySQL Data Connector.

To securely store your Planetscale password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 5.** Run the Spice runtime with `spice run` from this directory.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice runtime.

**Step 6.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 7.** Execute the query `select * from [local_table_name];` to see the AWS RDS table accelerated locally.
