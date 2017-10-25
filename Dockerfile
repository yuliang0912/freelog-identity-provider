FROM daocloud.io/node:8.1.2

MAINTAINER yuliang <yuliang@ciwong.com>

RUN mkdir -p /data/freelog-identity-provider

WORKDIR /data/freelog-identity-provider

COPY . /data/freelog-identity-provider

RUN npm install

#ENV
#VOLUME ['/opt/logs','/opt/logs/db','/opt/logs/koa','/opt/logs/track']

ENV NODE_ENV production
ENV PORT 7011

EXPOSE 7011

CMD [ "npm", "start" ]
