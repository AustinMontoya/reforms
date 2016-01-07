import * as ActionTypes from './action-types';

const initialControlState = (overrides) => Object.assign({
  valid: true,
  dirty: false,
  value: null,
  errors: []
}, overrides);

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
    }, {});
  } else {
    throw Error("'controls' parameter must be an array of strings or a POJO");
  }
}

export function createReduxControlGroup(groupName, controls) {
  var store = null;
  var actions = {};

  let defaultState = {
    controls: getDefaultControlsState(controls),
    errors: [],
    dirty: false,
    valid: true,
    submitting: false
  };

  const onValueChange = (name, value) => {
    store.dispatch({
      type: ActionTypes.REFORMS_CONTROL_VALUE_CHANGED,
      groupName,
      name,
      value
    });

    let controlActions = actions[name];
    if (controlActions && controlActions.REFORMS_CONTROL_VALUE_CHANGED)
      store.dispatch(actions[name].REFORMS_CONTROL_VALUE_CHANGED(value));
  }

  function onControlSoiled(name) {
    store.dispatch({
      type: ActionTypes.REFORMS_CONTROL_SOILED,
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
    } = store.getState().getIn(['controls', name]).toJS();

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

  function createAction(controlName, trigger, actionCreator) {
    actions[controlName] = actions[controlName] || {};
    actions[controlName][trigger] = actionCreator;
  }

  function connect(target) {
    store = target;
  }

  return {
    getControlProps,
    connect,
    defaultState,
    createReducer,
    createAction
  };
}
