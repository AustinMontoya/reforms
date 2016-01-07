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

export function chainReducers() {
  let reducers = arguments;
  return (state, action) => {
    for (let i=0; i < reducers.length; i++) {
      state = reducers[i](state, action);
    }

    return state;
  }
}

export function createControlsReducer(controlsMap = {}, actionType = ActionTypes.REFORMS_CONTROL_VALUE_CHANGED) {
  return (state, action) => {
    if (action.type !== actionType)
      return state;

    if (!controlsMap[action.name])
      return assignControlValue(state, action);

    return controlsMap[action.name](state, action);
  }
}

export function createControlsValidationReducer(controlsMap = {}, actionType = ActionTypes.REFORMS_CONTROL_VALUE_CHANGED) {
  return (group, action) => {
    if (action.type !== actionType)
      return group;

    return Object.keys(controlsMap).reduce((group, controlName) => {
      let newAction = Object.assign({}, action, {name: controlName});
      if (controlsMap[controlName])
        group = controlsMap[controlName](group, newAction);

      return assignControlValid(group, newAction);
    }, group);
  }
}

export function form(group, action) {
  group = group.set('valid', isValid(group));
  switch (action.type) {
    case ActionTypes.REFORMS_CONTROL_SOILED:
      group = markControlAsDirty(group, action);
      group = group.set('dirty', true);
      return group;
    case ActionTypes.REFORMS_CONTROL_VALUE_CHANGED:
      group = group.set('dirty', true);
      return group;
    default:
      return group;
  }
}

export function isValid(group) {
  return group
    .get('controls')
    .filterNot((control) => control.get('valid'))
    .size == 0;
}

export function assignControlValue(group, {name, value}) {
  return group.setIn(['controls', name, 'value'], value);
}

export function markControlAsDirty(state, action) {
  return state.setIn(['controls', action.name, 'dirty'], true);
}

const immutableErrorSetter = (controlOrGroup, error) => {
    return controlOrGroup.set('errors', List([error]));
}

export function assignControlValid(group, {name}) {
  return group.updateIn(['controls', name], (control) => (
    control.set('valid', control.get('errors').size == 0)
  ));
}

export function controlValidationRule(condition, errorMessage) {
  return (group, action) =>
    group.updateIn(['controls', action.name], (control) => (
      validate(control, condition(control), errorMessage)
    )
  );
}

export function validate(controlOrGroup, valid, errorMessage) {
  return controlOrGroup.update(
    'errors', (errors) => {
      errors = errors.filterNot((error) => error == errorMessage)
      return valid ? errors : errors.push(errorMessage);
    }
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
    controls: getDefaultControlsState(controls),
    errors: [],
    dirty: false,
    valid: true
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
