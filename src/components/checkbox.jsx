import React from 'react';
import ControlContainer from './control-container.jsx';
import handleChange from '../utils/handle-change';

const { PropTypes: pt } = React;

const Checkbox = (props) => (
  <ControlContainer {...props}>
    <input
      type="checkbox"
      checked={props.value}
      onChange={({ target: { checked } }) => props.onValueChange(checked)} />
  </ControlContainer>
);

Checkbox.propTypes = Object.assign({}, ControlContainer.propTypes,
  Object.freeze({
    value: pt.bool,
    onValueChange: pt.func
  })
);

export default Checkbox;
