var util = require('util');
var EventEmitter = require('events');

function Control() {
  EventEmitter.call(this);
  this.dirty = false;
  this.errors = [];
}

Control.prototype.getProps = function() {
  return {
    dirty: this.dirty,
    errorMessage: this.errors[0],
    onValueChange: (newVal) => this.emit('valueChange', newVal)
  };
};

util.inherits(Control, EventEmitter);
