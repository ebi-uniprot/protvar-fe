FROM nginx
RUN rm /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html/uniprot/protvar
COPY deploy/nginx.conf /etc/nginx/conf.d
