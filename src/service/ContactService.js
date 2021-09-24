const {v4: uuidv4, validate: uuidValidate} = require('uuid');

function createContactService({mapper, knex}) {
  return {
    addNewContact: (contactDto) => {
      return mapper.toContactDbEntry(contactDto, uuidv4())
        .then(contactEntry => {
          return knex.transaction(trx => {
            return checkIfContactExists(trx, contactEntry)
              .then(contactId => {
                if (Array.isArray(contactId) && contactId.length > 0) {
                  throw {
                    errorDescription: 'A contact with matching name and address already exists with id',
                    id: contactId
                  };
                }
                return checkIfPhoneNumberExists(trx, contactEntry)
                  .then(existingIds => {
                    if (Array.isArray(existingIds) && existingIds.length > 0) {
                      throw {
                        errorDescription: 'At least one contact exists with matching work/mobile/work phone number with id(s)',
                        matchingIds: existingIds
                      };
                    }
                    return trx.insert(contactEntry)
                      .into('contacts')
                      .returning('*')
                      .then(storedEntry => mapper.toContactDto(storedEntry[0]));
                  });
              });
          });
        });
    },

    getAllContacts: () => {
      return knex.transaction(trx => {
        return trx.select('*')
          .from('contacts')
          .then(contacts => contacts.map(c => mapper.toContactDto(c)));
      });
    },

    updateExistingContact: (contactDto, id) => {
      return mapper.toContactDbEntry(contactDto, id).then(contactEntry => {
        if (!uuidValidate(id)) {
          throw {
            errorMessage: `${id} is not a valid uuid`
          }
        }
        return knex.transaction(trx => {
          return checkIfContactExists(trx, contactEntry).then(existingIds => {
            if (nonMatchingIdExists(existingIds, id)) {
              throw {
                errorDescription: 'Can\'t update contact with name and address matching existing contact',
                existingIds: existingIds
              }
            }
            return checkIfPhoneNumberExists(trx, contactEntry).then(existingIds => {
              if (nonMatchingIdExists(existingIds, id)) {
                throw {
                  errorDescription: 'Can\'t update contact with phone number matching existing contact',
                  existingIds: existingIds
                }
              }
              return trx('contacts')
                .where({id: contactEntry['id']})
                .update(contactEntry)
                .returning('*')
                .then(storedEntry => mapper.toContactDto(storedEntry[0]));
            });
          });
        });
      });
    },

    getContact: (id) => {
      return knex.transaction(trx => {
        return trx.select('*')
          .from('contacts')
          .where({id: id})
          .then(retrievedEntryArray => mapper.toContactDto(retrievedEntryArray[0]))
      })
    },

    deleteContact: (id) => {
      return knex.transaction(trx => {
        return trx('contacts')
          .del()
          .where({id: id})
          .then(deletedCount => {
            if (deletedCount === 1) {
              return {info: `Successfully deleted ${deletedCount} record`}
            } else if (deletedCount === 0) {
              throw {
                errorDescription: `Could not find record with id, ${id}, for deletion`
              }
            } else {
              throw {
                errorDescription: `Found more than one record (${deletedCount} records) matching id, ${id}. ` +
                  'Rolling back transaction.'
              }
            }
          });
      });
    },

    retrieveCallList: () => {
      return knex.transaction(trx => {
        return trx.select('name_first', 'name_middle', 'name_last', 'phone_number_home')
          .from('contacts')
          .whereNotNull('phone_number_home')
          .orderBy('name_last')
          .orderBy('name_first')
          .then(results => results.map(result => {
            return {
              name: {
                first: result['name_first'],
                middle: result['name_middle'],
                last: result['name_last']
              },
              phone: result['phone_number_home']
            }
          }));
      });
    }

  }
}

module.exports = createContactService;

function nonMatchingIdExists(otherIdArray, currentId) {
  return otherIdArray.length > 1 || (otherIdArray.length === 1 && currentId !== otherIdArray[0]['id']);
}

function checkIfContactExists(trx, contactEntry) {
  return trx.select('id').from('contacts').where({
    name_first: contactEntry.name_first,
    name_middle: contactEntry.name_middle,
    name_last: contactEntry.name_last,
    address_street: contactEntry.address_street,
    address_city: contactEntry.address_city,
    address_state: contactEntry.address_state,
    address_zip: contactEntry.address_zip
  });
}

function checkIfPhoneNumberExists(trx, contactEntry) {
  const phoneNumbers = [contactEntry.phone_number_home,
    contactEntry.phone_number_mobile,
    contactEntry.phone_number_work].filter(n => n);

  return trx.select('id').from('contacts')
    .whereIn('phone_number_home', phoneNumbers)
    .orWhereIn('phone_number_mobile', phoneNumbers)
    .orWhereIn('phone_number_work', phoneNumbers);
}
