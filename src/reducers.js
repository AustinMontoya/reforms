import {Map} from 'immutable';

function mealGroup(state, action) {
  if (!state) {
    state = Map();
  }

  switch (action.type) {
    case 'REFORMS_CONTROL_SOILED':
      state = state.setIn(['controls', controlName, 'dirty'], true);
      break;
    case 'REFORMS_CONTROL_VALUE_CHANGED':
      state = mealControl(state, action);
      break;
    default:
      break;
  }

  return state;
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

  return state.setIn(key, fn(state.getIn(key), value));
}

function reduceFood(_state, value) {
  let errors = [];

  if (value === "tempeh bacon") {
    errors.push("Gross! Pick something else.");
  }

  return Map({value, errors});
}

function reduceExplanation(_state, value) {
  let errors = [];

  if (value.length < 20) {
    errors.push("You are holding back. Tell us more please.");
  }

  return Map({value, errors});
}

function reduceAgreement(_state, value) {
  let errors = [];

  if (!value) {
    errors.push('Ha! Like you really have a choice...');
  }

  return Map({value, errors});
}

const reduceProtein = (_state, value) => ({value, errors: []});

let reduceCountry = (_state, value) => {
  let errors = [];

  if (country == "")
    errors.push("You must pick sides.");

  return Map({value, errors});
}

export default mealGroup;
