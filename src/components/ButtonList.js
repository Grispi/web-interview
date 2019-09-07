import React, { Component } from 'react'

class ButtonList extends Component {
  render() {
    return this.props.options.map(option => (
      <label
        htmlFor={option.label}
        key={option.value}
        className={
          this.props.checked === option.value
            ? 'radio-inline checked-class'
            : 'radio-inline'
        }
      >
        {option.label}
        <input
          id={option.label}
          type="radio"
          value={option.value}
          checked={this.props.checked === option.value}
          onChange={() => {
            this.props.onChange(option.value)
          }}
          name={this.props.name}
        ></input>
      </label>
    ))
  }
}

export default ButtonList
