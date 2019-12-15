# AuthenticationService
Service to manage authentication

"env": {
    "DB_USER": "",
    "DB_PASSWORD": "",
    "DB_HOST": "localhost",
    "DB_PORT": "27017",
    "DB_NAME": "evnotify",
    "AUTHORIZATION_SERVICE": "127.0.0.1:3001/authorization"
}

```
DB_USER="" DB_PASSWORD="" DB_HOST="localhost" DB_PORT="27017" DB_NAME="evnotify" AUTHORIZATION_SERVICE="http://localhost:3001/authorization" mocha tests/* --timeout 999999 --exit
```