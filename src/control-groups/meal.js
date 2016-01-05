import {createReduxControlGroup, immutableAccessor} from '../utils/control-utils';

let controls = ['food', 'explanation', 'agreement', 'protein', 'country'];

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
