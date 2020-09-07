# Retro Achievements Twitch Extension

An extension for Twitch that displays the streamer's information from Retro Achievements.

## Installation

After cloning this project, perform these steps:

1. Download [mkcert](https://github.com/FiloSottile/mkcert) from the [latest release](https://github.com/FiloSottile/mkcert/releases/tag/v1.4.1) and save it to the root of your project clone.
2. If you are on \*nix system, you will need to edit the `package.json` file's `postinstall` script. Change the script to:

```
"postinstall": "sh install-cert.sh"
```

3. Run `npm install`. This will install the dependencies and then setup the localhost certificates for your local development environment.
