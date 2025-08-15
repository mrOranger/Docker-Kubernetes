FROM mysql:latest

COPY migrate.sql /docker-entrypoint-initdb.d/migrate.sql

ENV PORT 3306
ENV MYSQL_ROOT_PASSWORD root@2025
ENV MYSQL_USER admin
ENV MYSQL_PASSWORD admin@@2025
ENV MYSQL_DATABASE clients
ENV TZ Europe/Rome

EXPOSE ${PORT}

CMD ["mysqld"]
