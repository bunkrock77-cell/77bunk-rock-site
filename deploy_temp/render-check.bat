@echo off
curl.exe -I -s -o nul -w status:%{http_code} -H "Authorization: Bearer rnd_bJqbrxGoU8u2KwGzmPlFLKn6mzIo" https://api.render.com/v1/services
