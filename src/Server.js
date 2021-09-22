
import configureContainer from './config/ContactsConfig.js';
import express from 'express';

const awilixContainer = configureContainer();

/** For debugging purposes, print the registered DI modules **/
import awilix from 'awilix';
const modules = awilix.listModules(['service/*', 'application/*', 'config/*'], {cwd: 'src/'});
console.log("Modules:");
console.log(modules)

/** Resolve express app and routes from DI and start listening for requests **/
const expressApp = awilixContainer.resolve('expressApp')
awilixContainer.resolve('routes');
const port = awilixContainer
  .resolve('config')
  .get('port');
expressApp.listen(port, function() {
  console.log('Server is running on PORT:', port);
});


