import {Map, List} from 'immutable';
import {createReducer, defaultState} from '../control-groups/meal';

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
  let key = ['controls', name];
  var fn;

  if (name === 'food') {
    fn = reduceFood;
  } else if (name == 'explanation') {
    fn = reduceExplanation;
  } else if (name == 'agreement') {
    fn = reduceAgreement;
  } else if (name == 'protein') {
    fn = reduceProtein;
  } else if (name == 'country') {
    fn = reduceCountry;
  } else {
    throw Error(`Control not found: ${name}`);
  }

  return state.updateIn(key, (controlState) => fn(controlState, value));
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

function isValid(state) {
  return state.get('controls', Map()).filterNot((controlState, _controlName) =>
    controlState.get('errors').size == 0
  ).size == 0;
}

function reduceFood(state, value) {
  let errors = [];

  if (value === "tempeh bacon") {
    errors.push("Gross! Pick something else.");
  }

  return state
    .set('value', value)
    .set('errors', List(errors));
}

function reduceExplanation(state, value) {
  let errors = [];

  if (value.length < 20) {
    errors.push("You are holding back. Tell us more please.");
  }

  return state
    .set('value', value)
    .set('errors', List(errors));
}

function reduceAgreement(state, value) {
  let errors = [];

  if (!value) {
    errors.push('Ha! Like you really have a choice...');
  }

  return state
    .set('value', value)
    .set('errors', List(errors));
}

const reduceProtein = (state, value) => state.set('value', value)

let reduceCountry = (state, value) => {
  let errors = [];

  if (value == "")
    errors.push("You must pick sides.");

  return state
    .set('value', value)
    .set('errors', List(errors));
}

export default createReducer(meal);
