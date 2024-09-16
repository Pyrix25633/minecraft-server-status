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

forward-ports:
> sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4443
> sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080