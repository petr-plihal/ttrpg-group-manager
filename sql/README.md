# Connecting to the database

To connect to the database started with Docker compose, you can use `mysql` client. The command for connection in CLI is:
```bash
mysql --host=127.0.0.1 --port=6606 --user=ttrpg_user --password=ttrpg_pass ttrpg_db
```