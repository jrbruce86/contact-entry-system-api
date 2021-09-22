
function createContactService(config, knex) {
  return {
    addContact: (contact) => {
//  knex.transaction()
    },
    getAllContacts: () => {
      knex.transaction().select("*").from("contacts").then(res => console.log("Example res: " + res));
    }
  }
}
