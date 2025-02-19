# License Key Management System - KissAuth

This project is a Discord bot and a corresponding server application for managing license keys for a software service.

## Introduction

This project consists of a Discord bot and a server application designed to facilitate the creation, deletion, and checking of license keys for a software service. The Discord bot allows users to interact with the system via slash commands, while the server application handles the backend logic for managing the license keys.

## Features

- **Create Key**: Users can generate a license key for a client by providing their IP address and an admin password.
- **Delete Key**: Users can delete a license key associated with a client by providing the key and an admin password.
- **Check Key**: Users can verify the validity of a license key by providing the key and an admin password.
- **IP Association**: License keys are associated with specific IP addresses to prevent misuse.
- **Discord Integration**: Interaction with the system is facilitated through Discord slash commands.

## Installation

To install and set up the project, follow these steps:

1. Clone the project repository from GitHub:

    ```bash
    git clone https://github.com/Kisakay/KissAuth.git
    cd ./KissAuth
    ```

2. Install dependencies for both the Discord bot and the server application:

    ```bash
    cd server
    npm install

    cd ../client
    npm install
    ```

3. Configure the `config.ts` file in both the `server` and `client` directories with your Discord bot token, server details, and other configuration settings.

4. Start the server and the Discord bot:

    ```bash
    cd server
    npm start

    cd ../client
    npm start
    ```

## Usage

Once the server and bot are running, users can interact with the system via Discord slash commands. Here are some example commands:

- `/create`: Generates a license key for a client.
- `/delete`: Deletes a license key associated with a client.
- `/check`: Verifies the validity of a license key.

For more detailed usage instructions, refer to the project documentation or the help commands provided by the Discord bot.

## Contribute

Contributions to this project are welcome! If you encounter any bugs, have feature requests, or would like to contribute code, please submit an issue or pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Feel free to modify this README further to fit your project's specific details and requirements.
