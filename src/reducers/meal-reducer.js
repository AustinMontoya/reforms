import {Map, List} from 'immutable';
import {createReducer, defaultState} from '../control-groups/meal';
import {flow, checkValid} from '../utils/control-utils';

function assignControlValid(control) {
  return control.set('valid', control.get('errors').size == 0);
}

const validateFood = checkValid(
  (control) => control.get('value') !== "tempeh bacon",
  "Gross! Pick something else."
);

const validateExplanation = checkValid(
  (control) => control.get('value').length > 20,
  "You are holding back. Tell us more please."
);

const validateAgreement = checkValid(
  (control) => control.get('value') == true,
  "Ha! Like you really have a choice..."
);

const fieldReducers = {
  food: flow(assignControlValue, validateFood, assignControlValid),
  explanation: flow(assignControlValue, validateExplanation, assignControlValid),
  agreement: flow(assignControlValue, validateAgreement, assignControlValid),
  protein: assignControlValue,
  country: assignControlValue
}

function meal(state = defaultState, action) {
  switch (action.type) {
    case 'REFORMS_CONTROL_SOILED':
      state = state.setIn(['controls', action.name, 'dirty'], true);
      break;
    case 'REFORMS_CONTROL_VALUE_CHANGED':
      state = mealControl(state, action);
      break;
    case 'REQUEST_REMOTE_AGREEMENT_VALIDATION':
      state = state.setIn(['controls', 'agreement', 'validating'], true);
      break;
    case 'RECEIVE_REMOTE_AGREEMENT_VALIDATION':
      state = state.updateIn(['controls', 'agreement'], (control) => {
        control = checkValid(
          () => action.valid,
          "Our records indicate you cannot do this."
        )(control);

        return control.set('validating', false);
      });
      break;
    default:
      break;
  }

  return mealGroupForm(state, action);
}

function mealControl(state, {name, value}) {
  let updater = (controlState) => fieldReducers[name](controlState, value);
  return state.updateIn(['controls', name], updater);
}

function mealGroupForm(state, {type}) {
    state = state.set('valid', isValid(state));
    switch (type) {
      case 'REFORMS_CONTROL_SOILED':
      case 'REFORMS_CONTROL_VALUE_CHANGED':
        return state.set('dirty', true);
      default:
        return state;
    }
}

function isValid(group) {
  return group
    .get('controls')
    .filterNot((control) => control.get('valid'))
    .size == 0;
}

function assignControlValue(control, value) {
  return control.set('value', value);
}

export default createReducer(meal);
