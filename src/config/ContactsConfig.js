
import { createContainer, asClass, asFunction } from 'awilix'
import createInputValidator from "../application/InputValidator.js";
import config from "config";
import createContactService from "../service/ContactService.js";
import createRoutes from "../application/Routes.js";
import express from 'express';
import knex from 'knex';
import createMapper from "../application/Mapper.js";

function getConfig() {
  return config
}

function getKnex() {
  return knex({
    client: "postgresql",
    connection: config.get("databaseConnection"),
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

export default function configureContainer() {
  return createContainer().register({
    inputValidator: asFunction(createInputValidator).singleton(),
    contactService: asFunction(createContactService).singleton(),
    config: asFunction(getConfig).singleton(),
    knex: asFunction(getKnex).singleton(),
    routes: asFunction(createRoutes).singleton(),
    expressApp: asFunction(getExpressApp).singleton(),
    contactsService: asFunction(createContactService).singleton(),
    mapper: asFunction(createMapper).singleton()
  });
}

