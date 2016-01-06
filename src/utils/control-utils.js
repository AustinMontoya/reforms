import {Map, List} from 'immutable'

export const ActionTypes = {
  REFORMS_CONTROL_VALUE_CHANGED: 'REFORMS_CONTROL_VALUE_CHANGED',
  REFORMS_CONTROL_SOILED: 'REFORMS_CONTROL_SOILED'
};

const initialControlState = (overrides) => Object.assign({
  valid: true,
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

export function flow() {
  var funcs = arguments;
  return function(state) {
    let index = 0;
    let result = funcs[index].apply(this, arguments);

     while (++index < funcs.length) {
       result = funcs[index].call(this, result);
     }

     return result;
  }
}

const immutableErrorSetter = (controlOrGroup, error) => {
    return controlOrGroup.set('errors', List([error]));
}

export function checkValid(condition, errorMessage) {
  return (controlOrGroup) => controlOrGroup.update(
    'errors', (errors) => (
      condition(controlOrGroup)
      ? errors.filterNot((error) => error == errorMessage)
      : errors.push(errorMessage)
    )
  );
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
    }, {});
  } else {
    throw Error("'controls' parameter must be an array of strings or a POJO");
  }
}

export function createReduxControlGroup(groupName, controls, accessor) {
  var store = null;
  var actions = {};

  let defaultState = {
    controls: getDefaultControlsState(controls)
  };

  const onValueChange = (name, value) => {
    store.dispatch({
      type: ActionTypes.REFORMS_CONTROL_VALUE_CHANGED,
      groupName,
      name,
      value
    });

    if (actions[name].REFORMS_CONTROL_VALUE_CHANGED)
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

  function createAction(controlName, trigger, actionCreator) {
    actions[controlName] = actions[controlName] || {};
    actions[controlName][trigger] = actionCreator;
  }

  function connect(target) {
    store = target;
  }

  if (!accessor) {
    accessor = defaultAccessor;
  }

  return {
    getControlProps,
    connect,
    defaultState,
    createReducer,
    createAction
  };
}
