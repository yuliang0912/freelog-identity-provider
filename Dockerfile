FROM node:lts

MAINTAINER yuliang <yu.liang@freelog.com>

RUN mkdir -p /data/freelog-identity-provider

WORKDIR /data/freelog-identity-provider

COPY . /data/freelog-identity-provider

RUN npm install

#ENV
#VOLUME ['/opt/logs','/opt/logs/db','/opt/logs/koa','/opt/logs/track']

ENV EGG_SERVER_ENV prod
ENV PORT 7111
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 7111

CMD [ "npm", "start" ]
