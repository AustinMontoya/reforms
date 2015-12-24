const handleChange = (props) => (e) => {
  if (props.onChange){
    props.onChange(e);
  } else if (props.onValueChange) {
    props.onValueChange(e.target.value);
  }
}

export default handleChange;
