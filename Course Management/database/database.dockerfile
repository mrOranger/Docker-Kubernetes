FROM mysql

WORKDIR /var/www

COPY dump.sql /docker-entrypoint-initdb.d/dump.sql
COPY entrypoint.sh entrypoint.sh

RUN chmod 766 entrypoint.sh

ENV PORT 3306
ENV MYSQL_ROOT_PASSWORD root@2025
ENV MYSQL_USER admin
ENV MYSQL_PASSWORD admin@@2025
ENV MYSQL_DATABASE course_management

EXPOSE ${PORT}

# ENTRYPOINT ["/var/www/entrypoint.sh"]

CMD ["mysqld"]
