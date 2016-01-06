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
