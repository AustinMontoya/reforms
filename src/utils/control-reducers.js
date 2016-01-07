import * as ActionTypes from '../action-types';
import { validate } from './control-utils';

export function value(group, {name, value}) {
  return group.setIn(['controls', name, 'value'], value);
}

export function valid(group, {name}) {
  return group.updateIn(['controls', name], (control) => (
    control.set('valid', control.get('errors').size == 0)
  ));
}

export function dirty(group, action) {
  return group.setIn(['controls', action.name, 'dirty'], true);
}

export function valueMap(controlsMap = {}, actionType = ActionTypes.REFORMS_CONTROL_VALUE_CHANGED) {
  return (group, action) => {
    if (action.type !== actionType)
      return group;

    if (!controlsMap[action.name])
      return value(group, action);

    return controlsMap[action.name](group, action);
  }
}

export function validationRule(condition, errorMessage) {
  return (group, action) =>
    group.updateIn(['controls', action.name], (control) => (
      validate(control, condition(control), errorMessage)
    )
  );
}

export function validationRules(controlsMap = {}, actionType = ActionTypes.REFORMS_CONTROL_VALUE_CHANGED) {
  return (group, action) => {
    if (action.type !== actionType)
      return group;

    return Object.keys(controlsMap).reduce((group, controlName) => {
      let newAction = Object.assign({}, action, {name: controlName});
      if (controlsMap[controlName])
        group = controlsMap[controlName](group, newAction);

      return valid(group, newAction);
    }, group);
  }
}
