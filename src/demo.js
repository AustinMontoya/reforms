import TextField from './components/text-field.jsx';
import TextArea from './components/text-area.jsx';
import Checkbox from './components/checkbox.jsx';
import Select from './components/select.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import Control from './control';
import configureStore from './configure-store';
import DevTools from './dev-tools.jsx';

const appContainer = document.getElementById('app');

let initialControlState = {
  food: {
    value: "bacon"
  },
  agreement: {
    value: true
  },
  country: {
    value: "UK"
  }
};

let store = configureStore({controls: initialControlState});

const typesOfProtein = ["chicken", "steak", "tofu", "pork", "legumes"];
const countries = [
  { displayText: "Pick one", value: "" },
  { displayText: "Mexico", value: "MX" },
  { displayText: "Italy", value: "IT" },
  { displayText: "'Murica", value: "US" }
]

function createChangeHandler(store, controlName) {
  return (newValue) => {
    store.dispatch({
      type: 'REFORMS_CONTROL_VALUE_CHANGED',
      name: controlName,
      value: newValue
    });
  }
}

function createDirtyHandler(store, controlName) {
  return () => {
    store.dispatch({
      type: 'REFORMS_CONTROL_SOILED',
      name: controlName
    });
  }
}

function controlState(state, controlName, onChange) {
  let {
    valid: valid=true,
    dirty: dirty=false,
    value: value=null,
    errors: errors=[]
  } = state[controlName] || {};

  return {
    valid,
    dirty,
    value,
    errorMessage: errors[0],
    onValueChange: onChange
  };
}

function storeControlState(controlName) {
  return controlState(
    store.getState(),
    controlName,
    createChangeHandler(store, controlName)
  );
}

const render = () => (
  ReactDOM.render(
    <div>
      <div>
        <TextField
          label="Favorite Food"
          id="food"
          placeholder="yum!"
          {...storeControlState('food')}
        />
        <TextArea
          label="Explain why you like this food"
          id="explanation"
          placeholder="Don't be shy; tell us how you really feel!"
          {...storeControlState('explanation')} />
        <Checkbox
          label="I agree to eat whatever you put on my plate."
          {...storeControlState('agreement')} />
        <Select
          label="Preferred protein"
          options={typesOfProtein}
          {...storeControlState('protein')}/>
        <Select
          label="Favorite country for food"
          options={countries}
          {...storeControlState('country')} />
       </div>
       <DevTools store={store} />
      </div>
  , appContainer)
);

store.subscribe(render);

render();
