

function createRoutes({ routeHandlers, expressApp }) {
  expressApp.get("/contacts", routeHandlers.getAllContacts);
  expressApp.post('/contacts', routeHandlers.postNewContact);
  expressApp.put('/contacts/:id', routeHandlers.updateExistingContact);
  expressApp.get('/contacts/call-list', routeHandlers.getCallList);
  expressApp.get('/contacts/:id', routeHandlers.getContact);
  expressApp.delete('/contacts/:id', routeHandlers.deleteContact);
}

module.exports = createRoutes;


