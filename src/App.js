import React, { Component } from 'react'

import logo from './logo.png'
import { API_ENDPOINT } from './config'
import consultantTypeIcon from './type-icon.png'
import dateTimeIcon from './date-time-icon.png'
import appointmentTypeIcon from './appointment-type-icon.png'
import notesIcon from './notes-icon.png'

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
      initialDataError: null,
      submitError: null,
    }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => res.json())
      .then(json => {
        this.setState({ availableSlots: json })
      })
      .catch(error => {
        this.setState({ initialDataError: error })
      })
    fetch(`${API_ENDPOINT}/users/${this.state.userId}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ user: json })
      })
      .catch(error => {
        this.setState({ initialDataError: error })
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
    this.setState({ submitError: null })

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
            element => element.value === this.state.selectedConsultantType
          ).label + ' appointment',
      }),
    })
      // TODO handle success
      .then()
      .catch(error => this.setState({ submitError: error }))
  }

  handleChange(event) {
    this.setState({ notes: event.target.value })
  }

  canSubmit() {
    return (
      this.state.selectedConsultantType &&
      this.state.selectedTime &&
      this.state.selectedAppointmentType
    )
  }

  render() {
    if (this.state.initialDataError) {
      return (
        <Page>
          <h2>An error has occurred, please try again later.</h2>
        </Page>
      )
    } else {
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
        <Page>
          <div className="app-user">
            <h1>New appointment</h1>
            {this.state.user ? (
              <div className="user-info">
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
          <form>
            {this.state.submitError
              ? 'There was an error creating the appointment. Try again later'
              : null}
            <FormField
              title="Consultant Type"
              icon={{
                src: consultantTypeIcon,
                alt: 'Consultant type icon',
              }}
            >
              <ButtonList
                options={consultantTypeOptions}
                onChange={value =>
                  this.setState({
                    selectedConsultantType: value,
                    selectedTime: null,
                    selectedAppointmentType: null,
                  })
                }
                checked={this.state.selectedConsultantType}
                name="consultantType"
              />
            </FormField>

            <FormField
              title="Date & Time"
              icon={{
                src: dateTimeIcon,
                alt: 'Date and time icon',
              }}
            >
              <ButtonList
                options={slots.map(slot => ({
                  value: slot.time,
                  label: this.formatDatetime(slot.time),
                }))}
                onChange={value =>
                  this.setState({
                    selectedTime: value,
                    selectedAppointmentType: null,
                  })
                }
                name="dateTime"
                checked={this.state.selectedTime}
              />
            </FormField>

            <FormField
              title="Appointment Type"
              icon={{
                src: appointmentTypeIcon,
                alt: 'Appointment type icon',
              }}
            >
              <ButtonList
                options={availableSlotsForTime.map(type => ({
                  value: type,
                  label: type[0].toUpperCase() + type.substring(1),
                }))}
                checked={this.state.selectedAppointmentType}
                onChange={value =>
                  this.setState({ selectedAppointmentType: value })
                }
                name="appointmentType"
              />
            </FormField>
            <FormField
              title="Notes"
              icon={{
                src: notesIcon,
                alt: 'Notes icon',
              }}
            >
              <textarea
                value={this.state.notes || ''}
                onChange={e => this.handleChange(e)}
                placeholder="Describe your symptoms"
              />
            </FormField>
            <div className="button-div">
              <button
                type="submit"
                className="button"
                disabled={!this.canSubmit()}
                onClick={e => {
                  this.handleSubmit(e)
                }}
              >
                Book
              </button>
            </div>
          </form>
        </Page>
      )
    }
  }
}
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

export default App
