import React from 'react'
import ControlContainer from './control-container'
import handleChange from '../utils/handle-change'

const { PropTypes: pt } = React;

const TextArea = (props) => (
  <ControlContainer {...props}>
    <textarea
      value={props.value}
      placeholder={props.placeholder}
      onChange={handleChange(props)} />
  </ControlContainer>
);

TextArea.propTypes = Object.assign({}, ControlContainer.propTypes,
  Object.freeze({
    value: pt.string,
    placeholder: pt.string,
    onChange: pt.func,
    onValueChange: pt.func
  })
);

export default TextArea;
