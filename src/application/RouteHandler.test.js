

const request = require('supertest')
const createContactsConfig = require('../config/ContactsConfig.js');
const config = createContactsConfig();
const app = config.resolve('routes');
const knex = config.resolve('knex');

function createMockResult() {
  const res = {};
  // replace the following () => res
  // with your function stub/mock of choice
  // making sure they still return `res`
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const requestBody = {
  "name": {
    "first": "BobTestOnly",
    "middle": "Francis the fourteenth",
    "last": "SagetTestOnly"
  },
  "address": {
    "street": "8360 High Autumn Row",
    "city": "Cannon",
    "state": "South Carolina",
    "zip": "19797"
  },
  "phone": [
    {
      "number": "302-614-9122",
      "type": "home"
    }
  ],
  "email": "harold.gilkey@yahoo.com"
};

let storedContact = null;

beforeAll(async () => {
  await knex('contacts').del();
});


afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  knex.destroy();
  done()
})

test('Should store new contact', async () => {
  const res = await request(app)
    .post('/contacts')
    .send(requestBody)
  expect(res.statusCode).toEqual(200)
});

test('Should get all contacts', async () => {
  const res = await request(app)
    .get('/contacts')
    .send();
  expect(res.statusCode).toEqual(200);
  expect(res.body[0]).toHaveProperty('name');
  storedContact = res.body[0];
});

test( 'Should update a contact', async () => {
  const updatedContact = {};
  Object.assign(updatedContact, storedContact);
  updatedContact['phone'][0]['number'] = '302-614-9123';
  updatedContact['name']['first'] = 'John';
  const res = await request(app)
    .put(`/contacts/${storedContact['id']}`)
    .send(requestBody)
  expect(res.statusCode).toEqual(200);
})

test( 'Should get contact', async () => {
  const res = await request(app)
    .get(`/contacts/${storedContact['id']}`)
    .send(requestBody)
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('name');
});

test ('Should generate call list', async () => {
  const res = await request(app)
    .get(`/contacts/call-list`)
    .send(requestBody)
  expect(res.statusCode).toEqual(200);
  expect(res.body[0]).toHaveProperty('name');
});

test('Should delete contact', async () => {
  const res = await request(app)
    .delete(`/contacts/${storedContact['id']}`)
    .send(requestBody)
  expect(res.statusCode).toEqual(200);
})



