.RECIPEPREFIX=>

default:
> npm start

install:
> npm install
> cp settings/template.json settings/settings.json

generate-certificate:
> sudo certbot certonly --standalone

generate-selfsigned-certificate:
> mkdir -p ./certs
> openssl req -newkey rsa:4096 -x509 -sha512 -days 365 -nodes -out ./certs/cert.pem -keyout ./certs/key.pem