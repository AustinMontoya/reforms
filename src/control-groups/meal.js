import {createReduxControlGroup, immutableAccessor} from '../utils/control-utils';

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
  getControlProps
} = createReduxControlGroup('meals', controls, immutableAccessor);

export {
  createReducer,
  defaultState,
  connect,
  getControlProps
};
