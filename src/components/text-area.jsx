import React from 'react';
import ControlContainer from './control-container.jsx';
import handleChange from '../utils/handle-change';

const { PropTypes: pt } = React;
const DEFAULT_DIRTY_EVENT_NAME = 'onBlur';

const TextArea = (props) => {
  let dirtyEvent = {
    [props.dirtyEventName || DEFAULT_DIRTY_EVENT_NAME]: props.onDirty
  };

  return (
    <ControlContainer {...props}>
      <textarea
        value={props.value}
        placeholder={props.placeholder}
        onChange={handleChange(props)}
        {...dirtyEvent} />
    </ControlContainer>
  );
}

TextArea.propTypes = Object.assign({}, ControlContainer.propTypes,
  Object.freeze({
    value: pt.string,
    placeholder: pt.string,
    onChange: pt.func,
    onValueChange: pt.func,
    onBlur: pt.func,
    onKeydown: pt.func,
    onDirty: pt.func
  })
);

export default TextArea;
