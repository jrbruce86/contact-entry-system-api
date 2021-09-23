
export default function createMapper({inputValidator}) {
  return {
    toContactDbEntry: (requestDto, uuid) => {
      return new Promise( (resolve, reject) => {
        inputValidator.validateRequest(requestDto);
        const nameDto = requestDto['name'];
        const addressDto = requestDto['address'];
        const phoneDtoArray = requestDto['phone'];

        let homePhone = null;
        let mobilePhone = null;
        let workPhone = null;

        if (phoneDtoArray.length < 1) {
          reject('Expected at least one phone number to be provided.');
        }

        phoneDtoArray.forEach(phoneDto => {
          switch (phoneDto['type']) {
            case 'home':
              rejectIfPhoneTypePopulated(reject, homePhone, 'home')
              homePhone = phoneDto['number'];
              break;
            case 'mobile':
              rejectIfPhoneTypePopulated(reject, mobilePhone, 'mobile');
              mobilePhone = phoneDto['number'];
              break;
            case 'work':
              rejectIfPhoneTypePopulated(reject, workPhone, 'work');
              workPhone = phoneDto['number'];
              break;
            default:
              reject('Unexpected phone type, ' + phoneDto['type'] + 'encountered.');
          }
        })

        resolve({
          id: uuid,
          name_first: nameDto['first'],
          name_middle: nameDto['middle'],
          name_last: nameDto['last'],
          address_street: addressDto['street'],
          address_city: addressDto['city'],
          address_state: addressDto['state'],
          address_zip: addressDto['zip'],
          phone_number_home: homePhone,
          phone_number_mobile: mobilePhone,
          phone_number_work: workPhone,
          email: requestDto['email']
        });
      });
    },

    toContactDto: (contactEntry) => {
      return {
        id: contactEntry['id'],
        name: {
          first: contactEntry['name_first'],
          middle: contactEntry['name_middle'],
          last: contactEntry['name_last']
        },
        address: {
          street: contactEntry['address_street'],
          city: contactEntry['address_city'],
          state: contactEntry['address_state'],
          zip: contactEntry['address_zip']
        },
        phone: toPhoneDtoArray(contactEntry),
        email: contactEntry['email']
      }
    }
  }
}

/*****************************
 * Phone DTO helpers
 ****************************/

function toPhoneDtoArray(contactEntry) {
  const phoneDtoArray = [];
  pushToPhoneDtoArrayIfPresent(phoneDtoArray, 'home', contactEntry['phone_number_home']);
  pushToPhoneDtoArrayIfPresent(phoneDtoArray, 'work', contactEntry['phone_number_work']);
  pushToPhoneDtoArrayIfPresent(phoneDtoArray, 'mobile', contactEntry['phone_number_mobile']);
  return phoneDtoArray;
}

function pushToPhoneDtoArrayIfPresent(phoneDtoArray, phoneNumberType, phoneNumberValue) {
  if (phoneNumberValue !== null && phoneNumberValue !== undefined) {
    phoneDtoArray.push({number: phoneNumberValue, type: phoneNumberType});
  }
}

/*********************************
 *  Database Integrity Checks
 ********************************/

function rejectIfPhoneTypePopulated(reject, phoneNumberValue, phoneNumberType) {
  if (phoneNumberValue !== null && phoneNumberValue !== undefined) {
    reject({
      errorMessage: `Attempt made to store multiple ${phoneNumberType} phone numbers for a user. Only one number `
        + 'for each type is supported.'
    });
  }
}