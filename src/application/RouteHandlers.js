
function createRouteHandlers({contactService}) {
  return {

    getAllContacts: (req, res) => {
      contactService.getAllContacts()
        .then(contactDtoList => res.status(200).send(contactDtoList))
        .catch(error => res.status(500).send({errorMessage: 'Failed to obtain contacts', error: error}))
    },

    postNewContact: (req, res) => {
      contactService.addNewContact(req.body)
        .then(successfullyInsertedDto => {
          res.status(200).send({successResponse: `Successfully added new contact.`, contact: successfullyInsertedDto});
        }).catch(error => res.status(500).send({errorMessage: `Failed to insert contact`, error: error}))
    },

    updateExistingContact: (req, res) => {
      contactService.updateExistingContact(req.body, req.params['id'])
        .then(successfullyUpdatedDto => {
          res.status(200).send({
            successResponse: 'Successfully updated existing contact.',
            contact: successfullyUpdatedDto
          });
        }).catch(error => res.status(500).send({errorMessage: 'Failed to update contact', error: error}));
    },

    getCallList: (req, res) => {
      contactService.retrieveCallList()
        .then(successfullyRetrievedCallList => {
          res.status(200).send(successfullyRetrievedCallList);
        }).catch(error => res.status(500).send({errorMessage: 'Failed to retrieve call list', error: error}));
    },

    getContact: (req, res) => {
      contactService.getContact(req.params['id'])
        .then(successfullyRetrievedDto => {
          res.status(200).send(successfullyRetrievedDto);
        }).catch(error => res.status(500).send({errorMessage: 'Failed to retrieve contact', error: error}));
    },

    deleteContact: (req, res) => {
      contactService.deleteContact(req.params['id'])
        .then(successfullyDeletedDto => {
          res.status(200).send(successfullyDeletedDto);
        }).catch(error => res.status(500).send({errorMessage: 'Failed to delete contact', error: error}));
    }

  }
}

module.exports = createRouteHandlers;
