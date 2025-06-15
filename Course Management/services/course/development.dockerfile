FROM node:latest

RUN groupadd -g 1001 appgroup && \
    useradd -m -u 1001 -g appgroup -m appuser

WORKDIR /var/www

RUN chown -R appuser:appgroup /var/www /home/appuser

USER appuser:appgroup

COPY --chown=appuser:appgroup ./package.json .

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]
