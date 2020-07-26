var Ajv = require('ajv');
var ajv = new Ajv({ removeAdditional: true, allErrors: true }); // options can be passed, e.g. {allErrors: true}

const createSchema = {
  additionalProperties: false,
  definitions: {},
  properties: {
    name: {
      $id: '#/properties/name',
      type: 'string'
    }
  },

  required: ['name'],
  type: 'object'
};
export const validateCreateUser = ajv.compile(createSchema);
export const required_fields = createSchema.required;
