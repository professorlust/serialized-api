import React from "react";
import PropTypes from "prop-types";
const InputField = props => (
  <div>
    <label className="label">{props.title}</label>
    <input
      className="checkbox"
      name={props.name}
      type="checkbox"
      value={props.checked}
      onChange={props.controlFunc}
      required={props.isRequired}
    />
  </div>
);

InputField.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

export default InputField;
