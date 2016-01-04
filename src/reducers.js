function mealGroup(currentState = {
  controls: {}
}, action) {
  let newState = Object.assign({}, currentState);

  switch (action.type) {
    case 'REFORMS_CONTROL_SOILED':
      newState.controls[controlName].dirty = true;
      break;
    case 'REFORMS_CONTROL_VALUE_CHANGED':
      newState = mealControl(newState, action);
      break;
    default:
      break;
  }

  return newState;
}

function mealControl(state, {name, value}) {
  state = Object.assign({}, state);

  if (name === 'food') {
    state.controls.food = reduceFood(state.controls.food, value);
  } else if (name == 'explanation') {
    state.controls.explanation = reduceExplanation(state.controls.explanation, value);
  } else if (name == 'agreement') {
    state.controls.agreement = reduceAgreement(state.controls.agreement, value);
  } else if (name == 'protein') {
    state.controls.protein = reduceProtein(state.controls.protein, value);
  } else if (name == 'country') {
    state.controls.country = reduceCountry(state.controls.country, value);
  } else {
    throw Error(`Control not found: ${name}`);
  }

  return state;
}

function reduceFood(currentState, value) {
  let newState = Object.assign({}, currentState, {value, errors: []});

  if (value === "tempeh bacon") {
    newState.errors.push("Gross! Pick something else.");
  }

  return newState;
}

function reduceExplanation(currentState, value) {
  let newState = {value, errors: []};

  if (value.length < 20) {
    newState.errors.push("You are holding back. Tell us more please.");
  }

  return newState;
}

function reduceAgreement(currentState, value) {
  let newState = { value, errors: [] };

  if (!value) {
    newState.errors.push('Ha! Like you really have a choice...');
  }

  return newState;
}

const reduceProtein = (currentState, value) => ({value, errors: []});

let reduceCountry = (currentState, value) => {
  let newState = { value, errors: [] };

  if (country == "")
    newState.errors.push("You must pick sides.");

  return newState;
}

export default mealGroup;
