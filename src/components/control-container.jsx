import React from 'react';
import classnames from 'classnames';

const { PropTypes: pt } = React;

const getContainerClasses = (dirty, valid) => classnames({
  'reforms-control': true,
  'reforms-control-dirty': dirty,
  'reforms-control-invalid': !valid
});

const ControlContainer = ({
  label,
  className,
  children,
  errorMessage,
  inputId,
  dirty,
  valid
}) => (
  <div className={getContainerClasses(dirty, valid)}>
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
  dirty: pt.bool,
  valid: pt.bool
});

export default ControlContainer;
