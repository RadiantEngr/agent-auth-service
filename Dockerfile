FROM node:20
LABEL XBillPay Developers
RUN mkdir -p /agent-auth-service && \
    mkdir -p /logs
RUN cd /agent-auth-service && rm -rf *
WORKDIR /agent-auth-service
ADD package.json /agent-auth-service/package.json
RUN yarn && \
    yarn global add pm2
COPY . /agent-auth-service
RUN yarn tsc
EXPOSE 4040
CMD [ "node", "dist/src/main.js" ]                                                                                                                                                      
