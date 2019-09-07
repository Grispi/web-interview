import React, { Component } from 'react'

import { API_ENDPOINT } from './config'
import consultantTypeIcon from './type-icon.png'
import dateTimeIcon from './date-time-icon.png'
import appointmentTypeIcon from './appointment-type-icon.png'
import notesIcon from './notes-icon.png'

import Page from './components/Page'
import FormField from './components/FormField'
import ButtonList from './components/ButtonList'

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
      submitSucceeded: false,
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
      .then(() => this.setState({ submitSucceeded: true }))
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
          <h2 className="error">
            An error has occurred, please try again later.
          </h2>
        </Page>
      )
    } else if (this.state.submitSucceeded) {
      return (
        <Page>
          <h2>Your new appointment was created.</h2>
          <p>
            You will be seeing a {this.state.selectedConsultantType} on{' '}
            {this.formatDatetime(this.state.selectedTime)} by{' '}
            {this.state.selectedAppointmentType}.
          </p>
          {this.state.notes ? (
            <p>Additional notes: {this.state.notes}</p>
          ) : null}
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
                  alt={`${this.state.user['firstName']} Avatar`}
                />
                <strong>
                  {this.state.user['firstName']} {this.state.user['lastName']}
                </strong>
              </div>
            ) : null}
          </div>
          <form>
            {this.state.submitError ? (
              <p className="error">
                There was an error creating the appointment. Try again later
              </p>
            ) : null}
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

export default App
