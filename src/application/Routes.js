
import { v4 as uuidv4 } from 'uuid'

export default function createRoutes({ mapper, contactService, expressApp }) {
  // return {
  //    getAll: () => {
      expressApp.get("/", (req, res) => {
        contactService.getAllContacts()
          .then(contacts => res.status(200).send(JSON.stringify(contacts, null, 2)))
          .catch(error => res.status(500).send({errorMessage: `Failed to obtain contacts: ${error}`}))
       });
    // },

    // postContact: () => {
       expressApp.post('/contacts', (req, res) => {
         console.log("I'm in the post method yay!!");

         // TODO probably should turn this block into a promise for consistency sake
         let dbEntry = null;
         try {
           dbEntry = mapper.toContactDbEntry(req.body, uuidv4())
         } catch (error) {
           res.status(500).send(error);
           return;
         }

         contactService.addContact(dbEntry)
           .then(successfullyInsertedEntry => {
             console.log(`Successfully inserted the following contact table entry ${JSON.stringify(successfullyInsertedEntry, null, 2)}`);
             res.status(200).send('Successfully inserted contact!');
           }).catch(error => res.status(500).send({errorMessage: `Failed to insert contact`, error}))
       });
    // }
  // }
}


