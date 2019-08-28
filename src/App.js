import React, { Component } from 'react'

import logo from './logo.png'
import { API_ENDPOINT } from './config'

import './App.scss'

const consultantTypeOptions = [
  { value: 'gp', label: 'GP' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'physio', label: 'Physio' },
  { value: 'specialist', label: 'Specialist' },
]

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: 1,
      selectedConsultantType: 'gp',
      availableSlots: [],
      selectedTime: null,
      selectedAppointmentType: null,
      user: null,
      notes: null,
    }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => res.json())
      .then(json => {
        this.setState({ availableSlots: json })
      })
      .catch(() => {
        // TODO: Handle error here
      })
    fetch(`${API_ENDPOINT}/users/${this.state.userId}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ user: json })
      })
      .catch(() => {
        // TODO: Handle error here
      })
  }

  formatDatetime(value) {
    const d = new Date(value)
    const current_datetime = new Date()
    if (
      current_datetime.getFullYear() === d.getFullYear() &&
      current_datetime.getMonth() === d.getMonth() &&
      current_datetime.getDate() === d.getDate()
    ) {
      return 'Today ' + d.getHours() + ':' + d.getMinutes()
    }

    return (
      d.getDate() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getFullYear() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes()
    )
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log('submited')

    fetch(`${API_ENDPOINT}/appointments`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.userId,
        dateTime: this.state.selectedTime,
        notes: this.state.notes,
        type:
          consultantTypeOptions.find(
            element => element.value == this.state.selectedConsultantType
          ).label + ' appointment',
      }),
    })
  }

  handleChange(event) {
    this.setState({ notes: event.target.value })
  }

  render() {
    // calculate matching slots
    let slots = []
    for (let i = 0; i < this.state.availableSlots.length; i++) {
      for (
        let j = 0;
        j < this.state.availableSlots[i]['consultantType'].length;
        j++
      ) {
        if (
          this.state.availableSlots[i]['consultantType'][j] ===
          this.state.selectedConsultantType
        ) {
          slots.push(this.state.availableSlots[i])
        }
      }
    }
    const current_datetime = new Date()
    slots = slots.filter(slot => new Date(slot.time) > current_datetime)
    slots.sort((slot1, slot2) => new Date(slot1.time) - new Date(slot2.time))
    let availableSlotsForTime = []
    for (let i = 0; i < slots.length; i++) {
      for (let j = 0; j < slots[i]['appointmentType'].length; j++) {
        if (slots[i]['time'] === this.state.selectedTime) {
          availableSlotsForTime.push(slots[i]['appointmentType'][j])
        }
      }
    }

    return (
      <div className="app">
        <div className="app-header">
          <img src={logo} className="app-logo" alt="Babylon Health" />
        </div>

        <div className="app-header">
          <h2 className="h6">New appointment</h2>
          {this.state.user ? (
            <div>
              <img
                src={this.state.user['avatar']}
                className="avatar"
                alt="${this.state.user['firstName']} Avatar"
              />
              <strong>
                {this.state.user['firstName']} {this.state.user['lastName']}
              </strong>
            </div>
          ) : null}
        </div>
        <div style={{ maxWidth: 600, margin: '24px auto' }}>
          <div>
            <strong>Consultant Type</strong>
            <div>
              <ButtonList
                options={consultantTypeOptions}
                onChange={value =>
                  this.setState({ selectedConsultantType: value })
                }
              />
            </div>
          </div>
          <div>
            <strong>Date & Time</strong>
            <div>
              <ButtonList
                options={slots.map(slot => ({
                  value: slot.time,
                  label: this.formatDatetime(slot.time),
                }))}
                onChange={value => this.setState({ selectedTime: value })}
              />
            </div>
          </div>
          <div>
            <strong>Appointment Type</strong>
            <div>
              <ButtonList
                options={availableSlotsForTime.map(type => ({
                  value: type,
                  label: type[0].toUpperCase() + type.substring(1),
                }))}
                onChange={value =>
                  this.setState({ selectedAppointmentType: value })
                }
              />
            </div>
          </div>

          <div>
            <strong>Notes</strong>
            <textarea
              value={this.state.notes}
              onChange={e => this.handleChange(e)}
            />
          </div>

          <div>
            <button
              className="button"
              onClick={e => {
                this.handleSubmit(e)
                /* TODO: submit the data */
              }}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    )
  }
}

class ButtonList extends Component {
  render() {
    return this.props.options.map(option => (
      <div
        className="button"
        onClick={() => {
          this.props.onChange(option.value)
        }}
      >
        {option.label}
      </div>
    ))
  }
}

export default App
