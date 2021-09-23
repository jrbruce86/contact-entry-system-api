
import { v4 as uuidv4 } from 'uuid'

// TODO move logic for these methods into a separate controller object for testing
export default function createRoutes({ contactService, expressApp }) {

  expressApp.get("/contacts", (req, res) => {
    contactService.getAllContacts()
      .then(contactDtoList => res.status(200).send(contactDtoList))
      .catch(error => res.status(500).send({errorMessage: 'Failed to obtain contacts', error: error}))
  });

  expressApp.post('/contacts', (req, res) => {

    contactService.addNewContact(req.body)
      .then(successfullyInsertedDto => {
        res.status(200).send({successResponse: `Successfully added new contact.`, contact: successfullyInsertedDto});
      }).catch(error => res.status(500).send({errorMessage: `Failed to insert contact`, error: error}))
  });

  expressApp.put('/contacts/:id', (req, res) => {
    contactService.updateExistingContact(req.body, req.params['id'])
      .then(successfullyUpdatedDto => {
        res.status(200).send({successResponse: 'Successfully updated existing contact.', contact: successfullyUpdatedDto});
      }).catch(error => res.status(500).send({errorMessage: 'Failed to update contact', error: error}));
  });

  expressApp.get('/contacts/call-list', (req, res) => {
    contactService.retrieveCallList()
      .then(successfullyRetrievedCallList => {
        res.status(200).send(successfullyRetrievedCallList);
      }).catch(error => res.status(500).send({errorMessage: 'Failed to retrieve call list', error: error}));
  });

  expressApp.get('/contacts/:id', (req, res) => {
    contactService.getContact(req.params['id'])
      .then(successfullyRetrievedDto => {
        res.status(200).send(successfullyRetrievedDto);
      }).catch(error => res.status(500).send({errorMessage: 'Failed to retrieve contact', error: error}));
  });

  expressApp.delete('/contacts/:id', (req, res) => {
    contactService.deleteContact(req.params['id'])
      .then(successfullyDeletedDto => {
        res.status(200).send(successfullyDeletedDto);
      }).catch(error => res.status(500).send({errorMessage: 'Failed to delete contact', error: error}));
  });
}


