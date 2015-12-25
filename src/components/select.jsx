import React from 'react';
import ControlContainer from './control-container.jsx';
import handleChange from '../utils/handle-change';

const { PropTypes: pt } = React;

const renderOption = (opt, index) => (
  typeof opt === "string"
    ? <option key={index} value={opt}>{opt}</option>
    : <option key={index} value={opt.value}>{opt.displayText}</option>
);

const Select = (props) => (
  <ControlContainer {...props}>
    <select
      value={props.value}
      placeholder={props.placeholder}
      onChange={handleChange(props)}>
      {props.options.map(renderOption)}
    </select>
  </ControlContainer>
);

Select.propTypes = Object.assign({}, ControlContainer.propTypes,
  Object.freeze({
    value: pt.string,
    onChange: pt.func,
    onValueChange: pt.func,
    options: pt.arrayOf(
      pt.oneOfType([
        pt.string,
        pt.shape({
          displayText: pt.string.isRequired,
          value: pt.string.isRequired
        })
      ])
    ).isRequired
  })
);

export default Select;
