# CloudMsgr
Messenger in the cloud

## Build Container
`docker build . -t cloudmsgr`
## Start Container
`docker run --rm -d -p 8080:8080  -p 8081:8081 -v /<path to db files>:/opt/db_files -u $(id -u):$(id -g) cloudmsgr`
