

function createRoutes(inputValidator, contactService, expressApp) {
    // getAll: () => {
      expressApp.get("/", (req, res) => {
        contactService.getAllContacts(); // TODO make this into something useful..
        res.status(200).send('Hello world');
       });
    // },
    //
    // postContact: (request) => {
      expressApp.post("/contacts", (req, res) => {
        // TODO invoke validator, if there's an error return back a descriptive response
        // TODO invoke the ContactService to update the database...
        console.log("I'm in the post method yay!!");
      });
  //}
}


