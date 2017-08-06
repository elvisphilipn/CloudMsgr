FROM alpine
#  Build variables
ENV installDir /opt/cloudmsgr
ENV dbDir /opt/db_files
# Instrall needed distro packages
RUN apk add --no-cache nodejs nodejs-npm rethinkdb
# create the working directories
RUN mkdir -p ${installDir} ${dbDir}
WORKDIR ${installDir}
# Copy project files
ADD src/ ${installDir}
# Install project dependencies
RUN npm install --production
# Open up IP ports
EXPOSE 8080 8081
ENTRYPOINT ["npm", "start"]
