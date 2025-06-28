# Setup for development
To run the backend for development or testing locally, you can either:
- Use just Python with virtual environment - [Manual setup](#manual-setup).
- Use Docker to run the app in container [Docker setup](#docker-setup).

# Manual setup

## Prerequisites
- Python, 3.10.12 was used

## Running the application

1. Create and activate virtual environment for python.

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

5. Run the development server.
    ```bash
    python manage.py runserver
    ```
    The server should start on localhost (127.0.0.1) on port 8000, as mentioned from the output.
    
    To verify that the server is up and has testing data, go to [127.0.0.1:8000/users/](http://127.0.0.1:8000/users/), where you should se json response containing all testing users.

    **Note that the server on it's own only serves as a backend, is hosted locally, and hase little to zero safety measures.**

---

## Cleanup after the server

If you are done with the development and are not planning to come back to use the server, you can remove what was created during the setup.

1. Delete the database.
    ```bash
    sudo mysql -u root -p
    mysql> DATABASE test;
    mysql> exit
    ```

2. Deactivate and remove virtual environment.
    ````bash
    deactivate  # if venv is active
    rm -rf venv  # remove the venv containing packages
    ```

---

# Docker setup

## Prerequisites
- Docker

## Running the application

1. Build the Django Docker container. For me the building took 

    ```bash
    docker build -t ttrpg-backend .
    ```
    You can verify that the image was successfully built either by the output, or when running the command:
    ```bash
    docker image list
    ```

    You should see an output along the lines of:
    ```
    REPOSITORY                   TAG       IMAGE ID       CREATED          SIZE
    ttrpg-backend                latest    b9b5642bf0b1   35 seconds ago   1.62GB
    ```

2. Run the container.
    ```bash
    docker run -p 8000:8000 --name ttrpg-backend ttrpg-backend
    ```
    - `-p 8000:8000` maps the port 8000 to port 8000 on your machine, you can change this if you already have something running on that port.
    - ``

    **Note that the server on it's own only serves as a backend, is hosted locally, and hase little to zero safety measures.**

---

## Cleanup after the server

If you are done with the development and are not planning to come back to use the server, you can remove what was created during the setup.

1. 
---