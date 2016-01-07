import * as MealControlGroup from '../control-groups/meal';
import { validate, chainReducers } from '../utils/control-utils';
import { form } from '../utils/group-reducers';
import { validationRules, validationRule, valueMap } from '../utils/control-reducers';

const { createReducer, defaultState } = MealControlGroup;

function remoteAgreement(state, action) {
  switch(action.type) {
    case MealControlGroup.REQUEST_REMOTE_AGREEMENT_VALIDATION:
      return state.setIn(['controls', 'agreement', 'validating'], true);
    case MealControlGroup.RECEIVE_REMOTE_AGREEMENT_VALIDATION:
      return state.updateIn(['controls', 'agreement'], (control) => {
        control = validate(
          control,
          action.valid,
          "Our records indicate you cannot do this."
        );

        return control.set('validating', false);
      });
    default:
      return state;
  }
}

const values = valueMap();

const fieldValidation = validationRules({
  explanation: validationRule(
    (control) => (control.get('value') || "").length > 20,
    "You are holding back. Tell us more please."
  ),
  food: validationRule(
    (control) => control.get('value') !== "tempeh bacon",
    "Gross! Pick something else."
  ),
  agreement: validationRule(
    (control) => control.get('value') == true,
    "Ha! Like you really have a choice..."
  )
});

function groupValidation(group, action) {
  const valid = !(
       group.getIn(['controls', 'protein', 'value']) == "tofu"
    || group.getIn(['controls', 'country', 'value']) == "US"
  );

  return validate(
    group,
    valid,
    "Sorry, real 'Muricans don't eat tofu."
  );
}

const reduce = createReducer(chainReducers(
  values, // generic
  fieldValidation, // partially custom
  groupValidation, // completely custom
  remoteAgreement, // completely custom
  form // generic
));

export default chainReducers(reduce);
