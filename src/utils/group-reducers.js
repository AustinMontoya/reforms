import * as ControlReducers from './control-reducers';
import * as ActionTypes from '../action-types';

export function form(group, action) {
  group = group.set('valid', isValid(group));
  switch (action.type) {
    case ActionTypes.REFORMS_CONTROL_SOILED:
      group = ControlReducers.dirty(group, action);
      group = group.set('dirty', true);
      return group;
    case ActionTypes.REFORMS_CONTROL_VALUE_CHANGED:
      group = group.set('dirty', true);
      return group;
    case ActionTypes.REFORMS_BEGIN_SUBMISSION:
      return group.set('submitting', true);
    case ActionTypes.REFORMS_END_SUBMISSION:
      return group.set('submitting', false);
    default:
      return group;
  }
}

function isValid(group) {
  return group
    .get('controls')
    .filterNot((control) => control.get('valid'))
    .size == 0;
}
