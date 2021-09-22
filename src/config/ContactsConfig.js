
import { createContainer, asClass, asFunction } from 'awilix'
import config from "config";

function getConfig() {
  return require(config);
}

function getKnex() {
  return require("knex")({
    client: "postgresql",
    connection: config.get("databaseConnection"),
    useNullAsDefault: true
  })
}

export default function configureContainer() {
  const container = createContainer();
  container.register({
    inputValidator: asFunction(createInputValidator).singleton(),
    config: asFunction(getConfig).singleton(),
    knex: asFunction(getKnex).singleton(),
    contactService: asFunction(createContactService).singleton(),
  })
}

