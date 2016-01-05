import TextField from './components/text-field.jsx';
import TextArea from './components/text-area.jsx';
import Checkbox from './components/checkbox.jsx';
import Select from './components/select.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import Control from './control';
import configureStore from './configure-store';
import DevTools from './dev-tools.jsx';
import Immutable from 'immutable';
import {createReduxControlGroup, immutableAccessor} from './utils/control-utils';

const appContainer = document.getElementById('app');

let initialState = Immutable.fromJS({
  controls: {
    food: {
      value: "bacon"
    },
    agreement: {
      value: true
    },
    country: {
      value: "UK"
    }
  }
});

let store = configureStore(initialState);
let { getControlProps } = createReduxControlGroup(store, 'meals', immutableAccessor);

const typesOfProtein = ["chicken", "steak", "tofu", "pork", "legumes"];
const countries = [
  { displayText: "Pick one", value: "" },
  { displayText: "Mexico", value: "MX" },
  { displayText: "Italy", value: "IT" },
  { displayText: "'Murica", value: "US" }
];

const render = () => (
  ReactDOM.render(
    <div>
      <div>
        <TextField
          label="Favorite Food"
          id="food"
          placeholder="yum!"
          {...getControlProps('food')}
        />
        <TextArea
          label="Explain why you like this food"
          id="explanation"
          placeholder="Don't be shy; tell us how you really feel!"
          {...getControlProps('explanation')} />
        <Checkbox
          label="I agree to eat whatever you put on my plate."
          {...getControlProps('agreement')} />
        <Select
          label="Preferred protein"
          options={typesOfProtein}
          {...getControlProps('protein')}/>
        <Select
          label="Favorite country for food"
          options={countries}
          {...getControlProps('country')} />
       </div>
       <DevTools store={store} />
      </div>
  , appContainer)
);

store.subscribe(render);

render();
