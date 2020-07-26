var Ajv = require('ajv');
var ajv = new Ajv({ removeAdditional: true, allErrors: true }); // options can be passed, e.g. {allErrors: true}

const createSchema = {
  additionalProperties: false,
  definitions: {},
  properties: {
    score: {
      $id: '#/properties/score',
      type: 'number'
    }
  },

  required: ['score'],
  type: 'object'
};

export const validateCreateScore = ajv.compile(createSchema);
export const required_fields = createSchema.required;
