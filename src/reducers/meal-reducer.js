import {Map, List} from 'immutable';
import * as MealControlGroup from '../control-groups/meal';
import {
  controlValidationRule,
  ActionTypes,
  markControlAsDirty,
  assignControlValue,
  assignControlValid,
  isValid,
  createGroupReducer,
  createControlsReducer,
  chainReducers,
  form
} from '../utils/control-utils';

const {createReducer, defaultState} = MealControlGroup;

const validateFood = controlValidationRule(
  (control) => control.get('value') !== "tempeh bacon",
  "Gross! Pick something else."
);

const validateExplanation = controlValidationRule(
  (control) => control.get('value').length > 20,
  "You are holding back. Tell us more please."
);

const validateAgreement = controlValidationRule(
  (control) => control.get('value') == true,
  "Ha! Like you really have a choice..."
);

function startValidatingAgreement(state) {
  return state.setIn(['controls', 'agreement', 'validating'], true);
}

function finishValidatingAgreement(state, action) {
  state = state.updateIn(['controls', 'agreement'], (control) => {
    control = controlValidationRule(
      () => action.valid,
      "Our records indicate you cannot do this."
    )(control);

    return control.set('validating', false);
  });
}

function meal(state = defaultState, action) {
  switch (action.type) {
    case MealControlGroup.REQUEST_REMOTE_AGREEMENT_VALIDATION:
      return startValidatingAgreement(state);
    case MealControlGroup.RECEIVE_REMOTE_AGREEMENT_VALIDATION:
      return finishValidatingAgreement(state);
    default:
      return state;
  }
}

const fieldReducer = createControlsReducer({
  food: chainReducers(assignControlValue, validateFood, assignControlValid),
  explanation: chainReducers(assignControlValue, validateExplanation, assignControlValid),
  agreement: chainReducers(assignControlValue, validateAgreement, assignControlValid),
});

const reduce = chainReducers(fieldReducer, meal, form);

export default createReducer(reduce);
