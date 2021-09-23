
const Ajv = require('ajv/dist/jtd.js');

function createInputValidator() {
  // Ajv - schema validation
  const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

  // Build out the expected request schema for validation
  const jtdContactSchema = {
    properties: {
      name: {
        properties: {
          first: {type: "string"},
          last: {type: "string"}
        },
        optionalProperties: {
          middle: {type: "string"}
        }
      },
      address: {
        properties: {
          street: {type: "string"},
          city: {type: "string"},
          state: {type: "string"},
          zip: {type: "string"}
        }
      },
      phone: {
        elements: {
          properties: {
            number: {type: "string"},
            type: {enum: ["home", "work", "mobile"]}
          }
        }
      },
      email: {type: "string"}
    }
  }
  const validate = ajv.compile(jtdContactSchema);
  return {
    validateRequest: (requestBody) => {
      const valid = validate(requestBody);
      if (!valid) {
        console.log('ERROR: Schema validation failure');
        console.log(validate.errors);
        throw {
          errorDescription: 'Input schema validation failed on request body',
          requestBody: requestBody,
          errors: validate.errors
        };
      }
      // TODO add more validation logic
    }
  }

}

module.exports = createInputValidator;
