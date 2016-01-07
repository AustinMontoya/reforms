import {Map, List} from 'immutable';
import * as MealControlGroup from '../control-groups/meal';
import {
  controlValidationRule,
  ActionTypes,
  validate,
  createGroupReducer,
  createControlsReducer,
  createControlsValidationReducer,
  chainReducers,
  form
} from '../utils/control-utils';

const {createReducer, defaultState} = MealControlGroup;

function startValidatingAgreement(state) {
  return state.setIn(['controls', 'agreement', 'validating'], true);
}

function finishValidatingAgreement(state, action) {
  return state.updateIn(['controls', 'agreement'], (control) => {
    control = validate(
      control,
      action.valid,
      "Our records indicate you cannot do this."
    );

    return control.set('validating', false);
  });
}

function meal(state = defaultState, action) {
  switch (action.type) {
    case MealControlGroup.REQUEST_REMOTE_AGREEMENT_VALIDATION:
      return startValidatingAgreement(state, action);
    case MealControlGroup.RECEIVE_REMOTE_AGREEMENT_VALIDATION:
      return finishValidatingAgreement(state, action);
    default:
      return state;
  }
}

const fieldReducer = createControlsReducer();

const validationReducer = createControlsValidationReducer({
  explanation: controlValidationRule(
    (control) => (control.get('value') || "").length > 20,
    "You are holding back. Tell us more please."
  ),
  food: controlValidationRule(
    (control) => control.get('value') !== "tempeh bacon",
    "Gross! Pick something else."
  ),
  agreement: controlValidationRule(
    (control) => control.get('value') == true,
    "Ha! Like you really have a choice..."
  )
});

function countryProtein(group, action) {
  const valid = (
       group.getIn(['controls', 'protein', 'value']) == "tofu"
    && group.getIn(['controls', 'country', 'value']) == "US"
  );

  return validate(
    group,
    valid,
    "Sorry, real 'Muricans don't eat tofu."
  );
}

const reduce = chainReducers(
  fieldReducer,
  validationReducer,
  countryProtein,
  meal,
  form
);

export default createReducer(reduce);
