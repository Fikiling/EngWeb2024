FROM node 
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb && \
    apt install ./mongodb-database-tools-*.deb && \
    rm -f mongodb-database-tools-*.deb
RUN npm install

# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 29050
CMD [ "npm", "start" ]