# Tabletop RPG game group manager

## Description
Web application for managing tabletop game player groups (TTRPG LFG tool). The application was designed and implemented according to the requirements of real potential users, and the results were tested with them; all details are provided in the [Technical report](./docs/technical_report.pdf). The Django backend was implemented collaboratively by a team, with each member then developing their own front end using their preferred framework.

---

## Usage

### Dependencies

- Docker

### Setup

1. Clone the repository
    ```bash
    git clone https://github.com/petr-plihal/ttrpg-group-manager/
    cd ttrpg-group-manager
    ```

### Executing program

1. Run the application
    ```bash
    docker compose up --detach
    ```

    The application will be accessible on localhost at port TODO.

    **Warning: The application is intended for demonstration and development purposes, it runs locally and has little to no safety measures.**

2. Turn off the application
    ```bash
    docker compose down
    ```

---

## Authors

| Name                                            | Login    | Front end application folder                         |
|-------------------------------------------------|----------|------------------------------------------------------|
| [Petr Plíhal](https://github.com/petr-plihal)   | xpliha02 | [`xpliha02_vue_js/`](./xpliha02_vue_js/)             |
| [Marek Pecháň](https://github.com/n123443)      | xpecha14 | [`xpecha14_angular/`](./xpecha14_angular/)           |
| [Marek Kozumplík](https://github.com/marekoz)   | xkozum08 | [`xkozum08_react_native/`](./xkozum08_react_native/) |
| [Matyáš Oujezdský](https://github.com/saytaM12) | xoujez02 | [`xoujez04_svelte/`](./xoujez04_svelte/)             |
