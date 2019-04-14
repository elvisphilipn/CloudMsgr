# CloudMsgr
Messenger in the cloud built on Swagger (OpenApi), ExpressJS, Bootstrap and RethinkDB. The service is shipped as a Docker container, for on prem or cloud deployment.

## Build Container
To build a deployable instance of CloudMsgr, one would need to have the latest version of Docker installed on their computer, see https://www.docker.com/. In a termial, please enter the following command
```
docker build . -t cloudmsgr
```

## Start Container
Use the following command to start the container and service:
```
docker run --rm -d -p 8080:8080  -p 8081:8081 -v /<path to db files>:/opt/db_files -u $(id -u):$(id -g) cloudmsgr
```
- `--rm`: to dispose the container in the event of failure
- `-p 8080:8080`: forward CloudMsgr's HTTP service to the host port
- `-p 8081:8081`: forward RethinkDB's admin console to host (for dev or debugging)
- `-v <path>:/opt/db_files`: mount host volume to RethinkDB's files (in case container fails, can respawn new one without data loose. Also can be used for backing up prod data)

## Servce Endpoints
CloudMsgr esposes the following resources via HTTP:
- http://localhost:8080/ - the Web front end
- http://localhost:8080/cloudmsgr - the REST service
- http://localhost:8080/docs -the API documentations (interactive, for dev/debugging)
- http://localhost:8081/ - RethinkDB's console (for dev/debugging)
