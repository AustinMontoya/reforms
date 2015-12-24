import TextField from './components/text-field.jsx';
import TextArea from './components/text-area.jsx';
import Checkbox from './components/checkbox.jsx';
import ReactDOM from 'react-dom';
import React from 'react';

const appContainer = document.getElementById('app');

let state = {
  food: {
    value: "bacon",
    errorMessage: ""
  },
  explanation: {
    value: "",
    errorMessage: ""
  },
  agreement: {
    checked: true,
    errorMessage: ""
  }
};

const updateFood = (val) => {
  state.food.value = val;
  if (val === "tempeh bacon") {
    state.food.errorMessage = "Gross! Pick something else.";
  } else {
    state.food.errorMessage = "";
  }

  render();
};

const updateExplanation = (val) => {
  state.explanation.value = val;
  if (val.length < 20) {
    state.explanation.errorMessage = "You are holding back. Tell us more please.";
  } else {
    state.explanation.errorMessage = "";
  }

  render();
};

const updateAgreement = (agrees) => {
  state.agreement.checked = agrees;
  state.agreement.errorMessage = agrees ? "" : "Ha! Like you really have a choice...";
  render();
}

const render = () => (
  ReactDOM.render(
    <div>
      <TextField
        label="Favorite Food"
        id="food"
        placeholder="yum!"
        errorMessage={state.food.errorMessage}
        value={state.food.value}
        onValueChange={updateFood} />
      <TextArea
        label="Explain why you like this food"
        id="explanation"
        placeholder="Don't be shy; tell us how you really feel!"
        errorMessage={state.explanation.errorMessage}
        value={state.explanation.value}
        onValueChange={updateExplanation} />
      <Checkbox
        label="I agree to eat whatever you put on my plate."
        checked={state.agreement.checked}
        errorMessage={state.agreement.errorMessage}
        onValueChange={updateAgreement} />
     </div>
  , appContainer)
);

render();
