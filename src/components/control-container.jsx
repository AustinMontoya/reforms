import React from 'react';
import classnames from 'classnames';

const { PropTypes: pt } = React;

const getContainerClasses = (dirty) => classnames({
  'reforms-control': true,
  'reforms-control-dirty': dirty
});

const ControlContainer = ({
  label,
  className,
  children,
  errorMessage,
  inputId,
  dirty
}) => (
  <div className={getContainerClasses(dirty)}>
  { label &&
    <label htmlFor={inputId}>
      {label}
    </label> }
    <div className="reforms-control-input-container">
      {children}
      <div className="reforms-control-error-message">
        {errorMessage}
      </div>
    </div>
  </div>
);

ControlContainer.propTypes = Object.freeze({
  className: pt.string,
  label: pt.string,
  errorMessage: pt.string,
  inputId: pt.string,
  dirty: pt.bool
});

export default ControlContainer;
