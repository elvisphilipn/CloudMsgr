FROM alpine
#  Build variables
ENV installDir /opt/cloudmsgr
# Instrall needed distro packages
RUN apk add --no-cache nodejs nodejs-npm
# create the working directories
RUN mkdir -p ${installDir}
WORKDIR ${installDir}
# Copy project files
ADD src/ ${installDir}
# Install project dependencies
RUN npm install --production
# Open up IP ports
EXPOSE 8080
ENTRYPOINT ["npm", "start"]
