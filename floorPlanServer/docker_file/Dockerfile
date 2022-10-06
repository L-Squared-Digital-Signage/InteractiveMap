FROM node
WORKDIR /floorPlan
COPY ./app/package.json /floorPlan
RUN npm install
COPY ./app /floorPlan
CMD ["npm", "start"]

