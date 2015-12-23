import TextField from './components/text-field';
import ReactDOM from 'react-dom';
import React from 'react';

const appContainer = document.getElementById('app');

let state = {
  food: {
    value: "bacon",
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
     </div>
  , appContainer)
);

render();
