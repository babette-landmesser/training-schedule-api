FROM node
MAINTAINER Babette Landmesser <mail@babettelandmesser.de>

EXPOSE 7000
WORKDIR /home/node/app
ENV NODE_ENV production
ADD . /home/node/app/

# Install Dependencies
RUN npm cache clean -f
RUN npm install -g n
RUN n stable
RUN npm install
CMD ["npm", "start"]
