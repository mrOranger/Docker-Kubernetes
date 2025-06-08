FROM mysql

WORKDIR /var/www

COPY migrate.sql /docker-entrypoint-initdb.d/migrate.sql

ENV PORT 3306
ENV MYSQL_ROOT_PASSWORD root@2025
ENV MYSQL_USER admin
ENV MYSQL_PASSWORD admin@@2025
ENV MYSQL_DATABASE course_management_professors

EXPOSE ${PORT}

CMD ["mysqld"]
