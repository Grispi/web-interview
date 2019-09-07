import React, { Component } from 'react'
import logo from './logo.png'

class Page extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header logo">
          <img src={logo} className="app-logo" alt="Babylon Health" />
        </div>
        <div style={{ maxWidth: 600, margin: '24px auto' }}>
          <div className="container">{this.props.children}</div>
        </div>
      </div>
    )
  }
}

export default Page
