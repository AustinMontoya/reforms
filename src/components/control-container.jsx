import React from 'react';
const { PropTypes: pt } = React;

const ControlContainer = ({
  label,
  className,
  children,
  errorMessage,
  inputId
}) => (
  <div className="reforms-control">
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
  inputId: pt.string
});

export default ControlContainer;
