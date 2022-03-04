FROM node:14 AS node_builder
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY ./ ./
RUN yarn run build 

RUN ls
RUN ls nginx
RUN pwd

# done with node container
# ------------------------------------------------------------------------------------------------------------------------

FROM cmd.cat/envsubst AS envsubst

WORKDIR /app

# custom nginx set up
ARG NGINX_PORT
ARG DATA_SERVER
ARG DATA_PROTOCOL

RUN echo $NGINX_PORT $DATA_SERVER $DATA_PROTOCOL

# make sure to grab the template
COPY ./nginx/nginx_template.template ./nginx/nginx_template.template
RUN cat ./nginx/nginx_template.template | envsubst '${DATA_PROTOCOL}${NGINX_PORT}${DATA_SERVER}' > ./nginx.conf

# done setting up nginx file
# ------------------------------------------------------------------------------------------------------------------------

FROM twalter/openshift-nginx

WORKDIR /app

COPY --from=node_builder /app/build /app
COPY --from=envsubst /app/nginx.conf /etc/nginx/nginx.conf

RUN ls /app
RUN cat /etc/nginx/nginx.conf

EXPOSE $NGINX_PORT
