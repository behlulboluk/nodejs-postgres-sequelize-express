var Ajv = require('ajv');
var ajv = new Ajv({ removeAdditional: true, allErrors: true }); // options can be passed, e.g. {allErrors: true}

const createSchema = {
  additionalProperties: false,
  definitions: {},
  properties: {
    id: {
      $id: '#/properties/id',
      type: 'string'
    },
    name: {
      $id: '#/properties/name',
      type: 'string'
    },
    past: {
      $id: '#/properties/past',
      type: 'array'
    },
    present: {
      $id: '#/properties/present',
      type: 'array'
    }
  },

  required: ['name'],
  type: 'object'
};

var updateSchema = Object.create(createSchema);
updateSchema.required = ['id'];

export const validateCreateUser = ajv.compile(createSchema);
export const validateUpdateUser = ajv.compile(updateSchema);
export const required_fields = createSchema.required;
