FROM ubuntu:latest

ENV TZ=Europe/Moscow

WORKDIR ~

ARG DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update
RUN apt-get install -y wget gnupg2 software-properties-common git apt-utils vim dirmngr apt-transport-https ca-certificates curl binutils

# Installing NVM, NodeJS and NPM
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install --global yarn
RUN npm install modclean -g