// Setup nonce for Twitch CSP
const crypto = require("crypto");
const nonce = crypto.randomBytes(32).toString("base64");
// eslint-disable-next-line
__webpack_nonce__ = nonce;

export default nonce;
