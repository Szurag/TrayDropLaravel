<div align="center">

<img src="https://raw.githubusercontent.com/Szurag/TrayDropLaravel/main/src/resources/assets/img/banner.jpg" style="border-radius: 20px"><br><br>

# TrayDrop

High privacy and Lightweight Files and Clipboard cloud storage with share feature.<br>
**[Check it out »](https://traydrop.pl/)**<br><br><br>
**[Website](https://traydrop.pl/) · [TrayDrop Server](https://github.com/Szurag/TrayDropLaravel) · [Desktop App (in progress)](about:blank) · [Mobile App (in progress)](about:blank)**

</div><br><br>

## About

TrayDrop is an open-source website that allows you to upload files and clipboard content to the server and automatically synchronize between devices using websockets. Traydrop is also providing share links with expiration date, for easy share files. This lightweight solution will run even on the slowest machines, with instant synchronization. We offer our [Website](https://traydrop.pl/), but if you have an iOS based phone, you can use our Apple Shortcuts for faster access from the sharing drawer [Send to Traydrop](https://www.icloud.com/shortcuts/8c5c14d407644b0b8b082f55a0636acd) and [Share via Traydrop](https://www.icloud.com/shortcuts/c8a420cb5930449baab8c46bf74c09e7). Also if you want to set up a server on your hardware, you can do it using our [TrayDrop Server](https://github.com/Szurag/TrayDropLaravel) based on Laravel. There you will find a guide on how to do it and enjoy your private server.

## How to use?
- Go to [our Website](https://traydrop.pl/)
- Leave hostname default (if you stil don't have your own server)
- Register and enjoy!

## Server Installation (Linux)

### Requirements
- Docker engine
- Linux

### Installation
- Clone repository ```git clone https://github.com/Szurag/TrayDropLaravel.git```
- Enter to src folder ```cd TrayDropLaravel/src```
- Copy .env.example and save as .env ```cp .env.example .env```
- Edit if you need and type ```npm i```
- When npm installation is finished build frontend ```npm run build```
- When build is finished go back to the project root folder ```cd ..```
- Start docker container using ```docker compose up -d```
- Open http://localhost in browser and enjoy your private Traydrop server!

## Used technologies

- Laravel (Backend)
- React (Frontend)
- MariaDB (Database)
- Redis (Quick Access Database)
- Websockets (For instant sync without refresh)
- nginx (Web Server)

## Features

- Instant clipboard and files synchronization between clients
- Share links with expiration date for easier file sharing with friends
- High privacy, by encrypted passwords, files and clipboards

## Contributors

The project needs contributors to test the application in terms of privacy, vulnerability and bugs. If so, feel free to [open an issue](https://github.com/Szurag/TrayDropLaravel/issues) or [pull request](https://github.com/Szurag/TrayDropLaravel/pulls)

## Authors

- [@onhq11](https://github.com/onhq11) (Frontend)
- [@Szurag](https://github.com/Szurag) (Backend)
