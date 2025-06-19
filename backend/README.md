# Manual setup for developement

## Prerequisities

- Python, 3.10.12 was used


## Running the applictaion

1. Create and activate virtual enviroment for python.

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2. Install requirements.
    ```bash
    pip install -r requirements.txt
    ```

3. Create database for the application, using mysql (`mysqlclient` should be part of `requirements.txt`) with testing data.

    Create the database.
    ```bash
    sudo mysql -u root -p
    mysql> CREATE DATABASE test;
    ```

    Select the database and populate the database with testing data.
    ```bash
    mysql> USE test;
    mysql> SOURCE ../sql/testdata.sql
    ```

    Exit.
    ```bash
    mysql> exit
    ```

4. Execute migrations.
    ```bash
    python manage.py migrate
    ```

5. Run the developement server.
    ```bash
    python manage.py runserver
    ```
    The server should start on localhost (127.0.0.1) on port 8000, as mentioned from the output.
    
    To verify that the server is up and has testing data, go to [127.0.0.1:8000/users/](http://127.0.0.1:8000/users/), where you should se json response containing all testing users.

    **Note that the server on it's own only serves as a backend, is hosted locally, and hase zero to none safety measures.**

## Cleanup after the server

If you are done with the developement and are not planning to come back to use the server, you can remove what was created during the setup.

1. Delete the database.
    ```bash
    sudo mysql -u root -p
    mysql> DATABASE test;
    mysql> exit
    ```

2. Deactivate and remove virtual enviroment.
    ````bash
    deactivate  # if venv is active
    rm -rf venv  # remove the venv containing packages
    ```