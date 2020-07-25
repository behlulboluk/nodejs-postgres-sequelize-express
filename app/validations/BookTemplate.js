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
    score: {
      $id: '#/properties/score',
      type: 'number'
    }
  },

  required: ['name'],
  type: 'object'
};

var updateSchema = Object.create(createSchema);
updateSchema.required = ['id'];

export const validateCreate = ajv.compile(createSchema);
export const validateUpdate = ajv.compile(updateSchema);
export const required_fields = createSchema.required;
