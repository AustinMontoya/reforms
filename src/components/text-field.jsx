import React from 'react'
import ControlContainer from './control-container.jsx'
import handleChange from '../utils/handle-change'

const { PropTypes: pt } = React;

const TextField = (props) => (
  <ControlContainer {...props}>
    <input
      type="text"
      id={props.inputId}
      onChange={handleChange(props)}
      value={props.value} />
  </ControlContainer>
);

TextField.propTypes = Object.freeze(
  Object.assign({}, ControlContainer.propTypes, {
    value: pt.string,
    placeholder: pt.string,
    onChange: pt.func,
    onValueChange: pt.func
  })
);

export default TextField;
