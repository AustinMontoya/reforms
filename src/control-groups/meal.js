import {createReduxControlGroup, immutableAccessor, ActionTypes} from '../utils/control-utils';

let controls = {
  food: { value: 'bacon' },
  explanation: {},
  agreement: { errors: ['Ha! Like you really have a choice...'] },
  protein: {},
  country: {}
};

const {
  createReducer,
  defaultState,
  connect,
  getControlProps,
  createAction
} = createReduxControlGroup('meals', controls, immutableAccessor);

export const REQUEST_REMOTE_AGREEMENT_VALIDATION = 'REQUEST_REMOTE_AGREEMENT_VALIDATION';
function requestRemoteAgreementValidation(value) {
  return {
    type: REQUEST_REMOTE_AGREEMENT_VALIDATION,
    groupName: 'meals',
    name: 'agreement',
    value
  };
}

export const RECEIVE_REMOTE_AGREEMENT_VALIDATION = 'RECEIVE_REMOTE_AGREEMENT_VALIDATION';
function receiveRemoteAgreementValidation(valid) {
  return {
    type: RECEIVE_REMOTE_AGREEMENT_VALIDATION,
    groupName: 'meals',
    name: 'agreement',
    valid
  };
}

function saveMeal() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.REFORMS_BEGIN_SUBMISSION,
      groupName: 'meals'
    });

    setTimeout(() => dispatch({
      type: ActionTypes.REFORMS_END_SUBMISSION,
      groupName: 'meals',
      success: true
    }), 2000);
  }
}

createAction('agreement', ActionTypes.REFORMS_CONTROL_VALUE_CHANGED, (value) => {
  return (dispatch) => {
    dispatch(requestRemoteAgreementValidation(value));
    setTimeout(() => dispatch(receiveRemoteAgreementValidation(true)));
  };
});

export {
  createReducer,
  defaultState,
  connect,
  getControlProps,
  saveMeal
};
