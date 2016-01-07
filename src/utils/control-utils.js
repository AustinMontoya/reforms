export function chainReducers() {
  let reducers = arguments;
  return (state, action) => {
    for (let i=0; i < reducers.length; i++) {
      state = reducers[i](state, action);
    }

    return state;
  }
}

export function validate(controlOrGroup, valid, errorMessage) {
  return controlOrGroup.update(
    'errors', (errors) => {
      errors = errors.filterNot((error) => error == errorMessage)
      return valid ? errors : errors.push(errorMessage);
    }
  );
}
