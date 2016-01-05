import React from 'react';
import ControlContainer from './control-container.jsx';
import handleChange from '../utils/handle-change';

const { PropTypes: pt } = React;
const DEFAULT_DIRTY_EVENT_NAME = 'onBlur';

const TextField = (props) => {
  let dirtyEvent = {
    [props.dirtyEventName || DEFAULT_DIRTY_EVENT_NAME]: props.onDirty
  };

  return (
    <ControlContainer {...props}>
      <input
        type="text"
        id={props.inputId}
        onChange={handleChange(props)}
        value={props.value}
        {...dirtyEvent} />
    </ControlContainer>
  );
};

TextField.propTypes = Object.freeze(
  Object.assign({}, ControlContainer.propTypes, {
    value: pt.string,
    placeholder: pt.string,
    dirtyEventName: pt.string,
    onChange: pt.func,
    onDirty: pt.func,
    onKeypress: pt.func,
    onValueChange: pt.func
  })
);

export default TextField;
