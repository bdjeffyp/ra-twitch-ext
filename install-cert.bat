@ECHO OFF
mkcert -install -cert-file cert.pem -key-file key.pem localhost
type cert.pem key.pem > node_modules/webpack-dev-server/ssl/server.pem
del cert.pem key.pem