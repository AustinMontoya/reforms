import React from 'react'
import ControlContainer from './control-container'

const { PropTypes: pt } = React;

const TextField = (props) => (
  <ControlContainer {...props}>
    <input
      type="text"
      id={props.inputId}
      onChange={(e) => {
        if (props.onChange){
          props.onChange(e);
        } else if (props.onValueChange) {
          props.onValueChange(e.target.value);
        }
      }}
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
