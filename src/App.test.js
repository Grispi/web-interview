import React from 'react'
import App from './App'
import { API_ENDPOINT } from './config'
import { render, fireEvent, within } from '@testing-library/react'
import data from '../data/data.json'

const flushPromises = () => new Promise(setImmediate)

const user = {
  id: 1,
  firstName: 'Test',
  lastName: 'Testing',
  avatar: 'http://site.com/an-image.png',
}

const availableSlots = data.availableSlots

function mockApi() {
  jest.spyOn(window, 'fetch').mockImplementation(url => {
    if (url === `${API_ENDPOINT}/users/1`) {
      return Promise.resolve({
        json: () => user,
      })
    } else if (url === `${API_ENDPOINT}/availableSlots`) {
      return Promise.resolve({
        json: () => data.availableSlots,
      })
    } else if (url === `${API_ENDPOINT}/appointments`) {
      return Promise.resolve({
        json: () => ({}),
      })
    }
  })
}

function mockApiWithErrorInUsers() {
  jest.spyOn(window, 'fetch').mockImplementation(url => {
    if (url === `${API_ENDPOINT}/users/1`) {
      return Promise.reject(new Error('Failed!!'))
    } else if (url === `${API_ENDPOINT}/availableSlots`) {
      return Promise.resolve({
        json: () => availableSlots,
      })
    } else if (url === `${API_ENDPOINT}/appointments`) {
      return Promise.resolve({
        json: () => ({}),
      })
    }
  })
}

function mockApiWithErrorInAvailableSlots() {
  jest.spyOn(window, 'fetch').mockImplementation(url => {
    if (url === `${API_ENDPOINT}/users/1`) {
      return Promise.resolve({
        json: () => user,
      })
    } else if (url === `${API_ENDPOINT}/availableSlots`) {
      return Promise.reject(new Error('Failed!!'))
    } else if (url === `${API_ENDPOINT}/appointments`) {
      return Promise.resolve({
        json: () => ({}),
      })
    }
  })
}

function mockApiWithErrorInAppointments() {
  jest.spyOn(window, 'fetch').mockImplementation(url => {
    if (url === `${API_ENDPOINT}/users/1`) {
      return Promise.resolve({
        json: () => user,
      })
    } else if (url === `${API_ENDPOINT}/availableSlots`) {
      return Promise.resolve({
        json: () => availableSlots,
      })
    } else if (url === `${API_ENDPOINT}/appointments`) {
      return Promise.reject(new Error('Failed!!'))
    }
  })
}

test('can view the user name and avatar', async () => {
  mockApi()

  const { getByText, getByAltText } = render(<App />)

  await flushPromises()

  expect(getByText('Test Testing')).toBeDefined()
  expect(getByAltText('Test Avatar')).toBeDefined()
  expect(getByAltText('Test Avatar').src).toEqual(
    'http://site.com/an-image.png'
  )
})

test('if fetching the user fails, it shows an error page', async () => {
  mockApiWithErrorInUsers()

  const { getByText } = render(<App />)

  await flushPromises()

  expect(
    getByText('An error has occurred, please try again later.')
  ).toBeDefined()
})

test('if fetching available slots fails, it shows an error page', async () => {
  mockApiWithErrorInAvailableSlots()

  const { getByText } = render(<App />)

  await flushPromises()

  expect(
    getByText('An error has occurred, please try again later.')
  ).toBeDefined()
})

test('can view available consultant types', async () => {
  mockApi()

  const { getByText } = render(<App />)

  await flushPromises()

  const fieldSet = within(getByText('Consultant Type').parentElement)

  expect(fieldSet.getByLabelText('GP')).toBeDefined()
  expect(fieldSet.getByLabelText('Therapist')).toBeDefined()
  expect(fieldSet.getByLabelText('Physio')).toBeDefined()
  expect(fieldSet.getByLabelText('Specialist')).toBeDefined()
})

test('can select date and time based available slots for selected consultant type', async () => {
  mockApi()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  const dateSection = getByText('Date & Time').parentElement

  fireEvent.click(getByLabelText('GP'))
  expect(dateSection.querySelectorAll('label')).toHaveLength(5)
  expect(dateSection.querySelectorAll('label')[0].textContent).toEqual(
    '23/9/2019 19:20'
  )
  expect(dateSection.querySelectorAll('label')[1].textContent).toEqual(
    '8/10/2019 17:17'
  )
  expect(dateSection.querySelectorAll('label')[2].textContent).toEqual(
    '16/11/2019 16:18'
  )
  expect(dateSection.querySelectorAll('label')[3].textContent).toEqual(
    '27/11/2019 10:11'
  )
  expect(dateSection.querySelectorAll('label')[4].textContent).toEqual(
    '1/12/2019 14:16'
  )

  fireEvent.click(getByLabelText('Specialist'))
  expect(dateSection.querySelectorAll('label')).toHaveLength(2)
  expect(dateSection.querySelectorAll('label')[0].textContent).toEqual(
    '1/12/2019 14:16'
  )
  expect(dateSection.querySelectorAll('label')[1].textContent).toEqual(
    '26/12/2019 17:19'
  )
})

test('can submit a form when selecting all the fields and adding a note', async () => {
  mockApi()

  const { getByText, getByLabelText, getByPlaceholderText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))
  fireEvent.click(getByLabelText('Video'))
  fireEvent.change(getByPlaceholderText('Describe your symptoms'), {
    target: { value: 'I feel bad' },
  })

  fireEvent.click(getByText('Book'))

  expect(fetch).toHaveBeenCalledWith(
    `${API_ENDPOINT}/appointments`,
    expect.objectContaining({
      method: 'post',
      body: JSON.stringify({
        userId: 1,
        dateTime: '2019-10-08T16:17:30.000Z',
        notes: 'I feel bad',
        type: 'GP appointment',
      }),
    })
  )
})

test('can submit a form when selecting all the fields without a note', async () => {
  mockApi()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))
  fireEvent.click(getByLabelText('Video'))

  fireEvent.click(getByText('Book'))

  expect(fetch).toHaveBeenCalledWith(
    `${API_ENDPOINT}/appointments`,
    expect.objectContaining({
      method: 'post',
      body: JSON.stringify({
        userId: 1,
        dateTime: '2019-10-08T16:17:30.000Z',
        notes: null,
        type: 'GP appointment',
      }),
    })
  )
})

test('can submit if all fields are selected', async () => {
  mockApi()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))
  fireEvent.click(getByLabelText('Video'))

  expect(getByText('Book').attributes['disabled']).not.toBeDefined()
})

test('cannot submit if not all fields are selected', async () => {
  mockApi()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))

  expect(getByText('Book').attributes['disabled']).toBeDefined()
})

test('when submit is successful, it shows a success page', async () => {
  mockApi()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))
  fireEvent.click(getByLabelText('Video'))

  fireEvent.click(getByText('Book'))

  await flushPromises()

  expect(getByText('Your new appointment was created.')).toBeDefined()
})

test('when submit fails, it shows an error message in the form', async () => {
  mockApiWithErrorInAppointments()

  const { getByText, getByLabelText } = render(<App />)

  await flushPromises()

  fireEvent.click(getByLabelText('GP'))
  fireEvent.click(getByLabelText('8/10/2019 17:17'))
  fireEvent.click(getByLabelText('Video'))

  fireEvent.click(getByText('Book'))

  await flushPromises()

  expect(
    getByText('There was an error creating the appointment. Try again later')
  ).toBeDefined()
})
