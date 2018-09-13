FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Remote Assembly LLC <contact@remoteassembly.com>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Set work directory to /www
WORKDIR /www
# Install app dependencies
COPY package.json .
RUN apk --no-cache add --virtual builds-deps build-base python && \
    npm install && npm rebuild bcrypt --build-from-source && apk del builds-deps

# Copy app source
# COPY . .

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

# start command as per package.json
CMD ["npm", "run", "dev"]
