FROM nginx
COPY build /usr/share/nginx/html/uniprot/pepvep
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
