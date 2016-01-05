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
import * as mealGroup from './control-groups/meal';

const appContainer = document.getElementById('app');
const {getControlProps} = mealGroup;

let store = configureStore(Immutable.fromJS(mealGroup.defaultState));
mealGroup.connect(store);

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
          {...getControlProps('protein')} />
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
