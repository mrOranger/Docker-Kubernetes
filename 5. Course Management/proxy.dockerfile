FROM nginx

WORKDIR /etc/nginx

COPY nginx.conf .

RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]
