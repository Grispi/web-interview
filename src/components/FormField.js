import React, { Component } from 'react'

class FormField extends Component {
  render() {
    const label = (
      <React.Fragment>
        <img
          src={this.props.icon.src}
          className="type-icon"
          alt={this.props.icon.alt}
        />

        {this.props.title}
      </React.Fragment>
    )
    if (this.props.asFieldSet) {
      return (
        <fieldset className="form-field">
          <legend>{label}</legend>
          {this.props.children}
        </fieldset>
      )
    } else {
      return (
        <label className="form-field">
          {label}
          {this.props.children}
        </label>
      )
    }
  }
}

export default FormField
