import React, { Component } from 'react'

class ButtonList extends Component {
  render() {
    return this.props.options.map(option => (
      <React.Fragment key={option.value}>
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
        <label htmlFor={option.label} className="radio-inline">
          {option.label}
        </label>
      </React.Fragment>
    ))
  }
}

export default ButtonList
