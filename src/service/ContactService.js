
export default function createContactService({config, knex}) {
  return {
    addContact: (contactEntry) => {
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
                  .into('contacts');
              });
          });
      });
    },

    getAllContacts: () => {
      console.log('Hello world.. in the contact service!!');
      return knex.transaction(trx => {
        return trx.select('*').from('contacts')
      });
    }
  }
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

