.RECIPEPREFIX=>

default:
> npm start

install:
> npm install
> cp settings/template.json settings/settings.json

generate-certificates:
> sudo certbot certonly --standalone