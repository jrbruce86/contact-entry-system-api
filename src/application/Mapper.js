
export default function createMapper({inputValidator}) {
  return {

    toContactDbEntry: (requestDto, uuid) => {
      inputValidator.validateRequest(requestDto);
      const nameDto = requestDto['name'];
      const addressDto = requestDto['address'];
      const phoneDtoArray = requestDto['phone'];

      let homePhone = null;
      let mobilePhone = null;
      let workPhone = null;

      if (phoneDtoArray.length < 1) {
        throw 'Expected at least one phone number to be provided.';
      }

      phoneDtoArray.forEach(phoneDto => {
        switch(phoneDto['type']) {
          case 'home':
            throwIfPhoneTypePopulated(homePhone, 'home')
            homePhone = phoneDto['number'];
            break;
          case 'mobile':
            throwIfPhoneTypePopulated(mobilePhone, 'mobile');
            mobilePhone = phoneDto['number'];
            break;
          case 'work':
            throwIfPhoneTypePopulated(workPhone, 'work');
            workPhone = phoneDto['work'];
            break;
          default:
            throw 'Unexpected phone type, ' + phoneDto['type'] + 'encountered.';
        }
      })

      return {
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
      }
    },
  }

  // TODO continue here.. need output dto...
//  toContactDto: (contactEntry)
}

function throwIfPhoneTypePopulated(phoneNumberValue, phoneNumberType) {
  if (phoneNumberValue != null) {
    throw `Attempt made to store multiple ${phoneNumberType} phone numbers for a user. Only one number `
          + 'for each type is supported.';
  }
}