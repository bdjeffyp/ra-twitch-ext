# RetroAchievements Twitch Extension

An extension for Twitch that displays the streamer's information from [RetroAchievements](http://retroachievements.org/).

The latest release version can be found on the [Twitch Extensions Page](https://dashboard.twitch.tv/extensions/h2bgu1pjhgehu4zrf4fc02cnastgri).

Feel free to use this project as a base for other Twitch panel extensions!

## Installation

After cloning this project, perform these steps:

1. Follow directions for [Getting started with Twitch extensions](https://dev.twitch.tv/docs/extensions) to set up your Local Test while you make changes to this project.
2. Download [mkcert](https://github.com/FiloSottile/mkcert) from the [latest release](https://github.com/FiloSottile/mkcert/releases/tag/v1.4.1) and save it to the root of your project clone.
3. If you are on \*nix system, you will need to edit the `package.json` file's `postinstall` script. Change the script to:

```
"postinstall": "sh install-cert.sh"
```

4. Run `npm install`. This will install the dependencies and then setup the localhost certificates for your local development environment.
