# CloudMsgr
Messenger in the cloud

## Build Container
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
