import React from 'react';
import ControlContainer from './control-container.jsx';
import handleChange from '../utils/handle-change';

const { PropTypes: pt } = React;

const RadioGroupOption = (props) => {
  let inputId = `${props.groupName}__${props.value}`;
  return (
    <div className="reforms-radio-group-option">
      <input
        type="radio"
        id={inputId}
        name={props.groupName}
        checked={props.groupValue === props.value}
        onChange={() => props.onSelected(props.value)} />
      <label htmlFor={inputId}>
        {displayText}
      </label>
    </div>
  );
};

RadioGroupOption.propTypes = Object.freeze({
  groupName: pt.string.isRequired,
  groupValue: pt.string.isRequired,
  value: pt.string.isRequired,
  onSelected: pt.func.isRequired
  displayText: pt.string.isRequired
});

const RadioGroup = (props) => (
  <ControlContainer {...props}>
    {props.options.map((option, index) =>
      <RadioGroupOption
        {...option}
        key={index}
        groupName={props.name}
        groupValue={props.value}
        onSelected={props.onValueChange} />
    )}
  </ControlContainer>
);

RadioGroup.propTypes = Object.assign({}, ControlContainer.propTypes,
  Object.freeze({
    value: pt.string,
    onValueChange: pt.func,
    options: pt.arrayOf(
      pt.shape({
        displayText: pt.string.isRequired,
        value: pt.string.isRequired
      })
    ).isRequired
  })
);

export default RadioGroup;
