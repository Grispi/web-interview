import React, { Component } from 'react'

class FormField extends Component {
  render() {
    return (
      <fieldset>
        <legend>
          <img
            src={this.props.icon.src}
            className="type-icon"
            alt={this.props.icon.alt}
          />

          {this.props.title}
        </legend>
        {this.props.children}
      </fieldset>
    )
  }
}

export default FormField
