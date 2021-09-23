
const awilix = require('awilix');
const createInputValidator = require('../application/InputValidator.js');
const config = require('config');
const createContactService = require('../service/ContactService.js');
const createRoutes = require('../application/Routes.js');
const express = require('express');
const knex = require('knex');
const createMapper = require('../application/Mapper.js');
const createRouteHandlers = require('../application/RouteHandlers.js');

function getConfig() {
  return config
}

function getKnex() {
  return knex({
    client: 'postgresql',
    connection: config.get('databaseConnection'),
    useNullAsDefault: true,
    debug: true
  })
}

function getExpressApp() {
  const expressApp = express();
  // use only when you want to see the metric related to express app
  // app.use(require('express-status-monitor')());
  expressApp.use(express.json());
  return expressApp;
}

function configureContainer() {
  const container = awilix.createContainer().register({
    inputValidator: awilix.asFunction(createInputValidator).singleton(),
    contactService: awilix.asFunction(createContactService).singleton(),
    config: awilix.asFunction(getConfig).singleton(),
    knex: awilix.asFunction(getKnex).singleton(),
    routes: awilix.asFunction(createRoutes).singleton(),
    expressApp: awilix.asFunction(getExpressApp).singleton(),
    contactsService: awilix.asFunction(createContactService).singleton(),
    mapper: awilix.asFunction(createMapper).singleton(),
    routeHandlers: awilix.asFunction(createRouteHandlers).singleton()
  });
  /** For debugging purposes, print the registered DI modules **/
  const modules = awilix.listModules(['service/*', 'application/*', 'config/*'], {cwd: 'src/'});
  console.log("Modules:");
  console.log(modules)
  // Return the container
  return container;
}
module.exports = configureContainer;

