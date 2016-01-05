import {Map} from 'immutable'

export function immutableAccessor(state, name) {
  return state.getIn(['controls', name], Map()).toObject();
}

export function defaultAccessor(state, name) {
  return state.controls[name];
}

export function createReduxControlGroup(store, groupName, accessor) {
  function onValueChange(name, value) {
    store.dispatch({
      type: 'REFORMS_CONTROL_VALUE_CHANGED',
      groupName,
      name,
      value
    });
  }

  function onControlSoiled(name) {
    store.dispatch({
      type: 'REFORMS_CONTROL_SOILED',
      groupName,
      name
    })
  }

  function getControlProps(name, dirtyEventName) {
    let {
      valid: valid=true,
      dirty: dirty=false,
      value: value=null,
      errors: errors=[]
    } = accessor(store.getState(), name);

    let controlState = {
      valid,
      dirty,
      value,
      errorMessage: errors[0],
      dirtyEventName,
      onDirty: () => onControlSoiled(name),
      onValueChange: (newVal) => onValueChange(name, newVal)
    };

    return controlState;
  }

  if (!accessor) {
    accessor = defaultAccessor;
  }

  return { getControlProps };
}
