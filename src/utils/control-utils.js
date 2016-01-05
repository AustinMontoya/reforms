import {Map} from 'immutable'

const initialControlState = (overrides) => Object.assign({
  dirty: false,
  value: null,
  errors: []
}, overrides);

export function immutableAccessor(state, name) {
  return state.getIn(['controls', name]).toJS();
}

export function defaultAccessor(state, name) {
  return state.controls[name];
}

function getDefaultControlsState(controls) {
  if (Array.isArray(controls)) {
    // if they are strings, just initialize them with the defaults
    return controls.reduce((state, name) => {
      state[name] = initialControlState();
      return state;
    }, {});
  } else if (typeof controls == "object") {
    return Object.keys(controls).reduce((state, name) => {
      state[name] = initialControlState(controls[name]);
      return state;
    });
  } else {
    throw Error("'controls' parameter must be an array of strings or a POJO");
  }
}

export function createReduxControlGroup(groupName, controls, accessor) {
  var store = null;

  let defaultState = {
    controls: getDefaultControlsState(controls)
  };

  const onValueChange = (name, value) => (
    store.dispatch({
      type: 'REFORMS_CONTROL_VALUE_CHANGED',
      groupName,
      name,
      value
    })
  )

  function onControlSoiled(name) {
    store.dispatch({
      type: 'REFORMS_CONTROL_SOILED',
      groupName,
      name
    })
  }

  function getControlProps(name, dirtyEventName) {
    let {
      valid: valid=null,
      dirty: dirty=false,
      value: value=null,
      errors: errors=[]
    } = accessor(store.getState(), name);

    if (valid == null) {
      valid = errors.length == 0;
    }

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

  function createReducer(reducingFn) {
    return (state, action) => {
      if (action.groupName === groupName)
        return reducingFn(state, action);

      return state;
    }
  }

  function connect(target) {
    store = target;
  }

  if (!accessor) {
    accessor = defaultAccessor;
  }

  return { getControlProps, connect, defaultState, createReducer };
}
