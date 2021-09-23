

/** Resolve express app and routes from DI and start listening for requests **/
const configureContainer = require('./config/ContactsConfig.js');
const awilixContainer = configureContainer();
const expressApp = awilixContainer.resolve('expressApp')
awilixContainer.resolve('routes');
const port = awilixContainer
  .resolve('config')
  .get('port');
expressApp.listen(port, function() {
  console.log('Server is running on PORT:', port);
});
