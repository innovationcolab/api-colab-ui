FROM    debian:jessie

RUN     apt-get update
RUN     apt-get install -y curl
RUN     curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN     apt-get install -y nodejs

COPY    . /src
RUN     cd /src ; npm install
RUN     npm install -g gulp
RUN     cd /src ; gulp build

VOLUME  ["/src/dist"]
