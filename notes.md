# NOTES

## How long did it take?

- ?

## Overview

You should:

- provide an overview of how you approached this challenge
- explain any trade-offs you made here, for example if you decided to take less time on the styling so you could concentrate on tests
- explain what you would have done next, for example you might decide to write more tests or spend more time on styling

## General Feedback

- Is there anything we need to improve or make clearer?

The exercise took me 5 days of two hours each approximately, for a total of 10-12 hours.

On the first iteration, I tried to make the API calls and receive the data from the backend without caring too much about the format, or the sort order. Regarding the code structure, I kept working in a single file as provided in the exercise as I found it easier to work with. Once I got the data into the UI, I focused on formatting it, particularly for date-times as the format wasn't very clear from the provided design, so I chose my own.
I made the decision to show the consultant types and appointment types in the order as I found them in the API response. I could have ordered them by some other criteria if needed. I also created a mapping from the text I received from the API to a text to show on the page as there was no way to transform the capitalisation in a uniform way (for example, "gp" is transformed to "GP", but "specialist" is transformed to "Specialist"). For the appointment types, I transformed them capitalising the first letter.
Again, regarding appointment types, I assumed those types could depend on the data for available slots coming from the API, so that's why you cannot choose an appointment type before selecting a date and time.
Also, to avoid selecting invalid combinations, whenever you select some value from a previous field, the next fields will reset.

After having the data in their respective places in the UI, I focused on creating some reusable components for them as the structure was very similar between them. That was the case for the ButtonList component, which shows the list of button options to choose from in each field. After doing this, I was able to change their structure to be more accessible, by making them use form inputs with labels, and having a form with the structure for fields (FormField component).

Alongside creating the form, I also started adding some styles to make the page look nicer, by adding CSS rules and also slightly changing the HTML structure, like adding containers around some elements. I also changed the page font, which I got from the Babylonhealth site, and I also added the icons as images obtained from the designs. I didn't include a burger menu though, as I didn't have an option to put into it, so it wouldn't be functional.

I changed the styles directly by looking at the page using the developer tools simulating a mobile screen. I also didn't include any media queries as I didn't think it was needed for this screen. If there is a case where we want to take more advantage of the real estate of desktop, maybe we could make the design slightly different thereby using media queries.

Finally, I added error handling for the initial data and the form submission, and I also added a success page to show after submitting the form successfully. Due to showing both the error page and the success page, I ended up creating another "Page" component that had all the common structure for all the pages, so that I could reuse it.

Doing several tests, I found it would be necessary to add a disabled state for the submit button to avoid submitting the form if not all the fields were selected yet. I did this by creating a function "canSubmit" and using it for the value of the disabled attribute in the button. I didn't add the notes into this function as the notes are optional and the form can still be submitted if there are no notes.

Another decision that I made was to follow the documentation for the POST/appointments API and use the same fields that were there. I found it a bit confusing as the appointment type was not part of the fields, and the fields didn't correspond to the ones that appeared in the data.json file. Anyway, I followed what was documented in the exercise.

After I reached to this stage of the app, I decided to split the single file into several by moving the components I created. This helped to reduce the size of files into something more manageable.

For tests, I decided to use react testing library as it is one of the recommended ones in create-react-app documentation, and it allows to test the entire app in a similar way I was doing it manually.

I created several tests for the different things I was trying manually, like seeing the user information, selecting different fields, submitting the form, and handling errors. I had to use Jest spyOn function to mock the fetch function I was using to call the API, in order to simulate the data returned and also to simulate the errors in some tests.

Regarding improvements and what to do next, I would like to include more tests in order to cover more cases, one of these is if the date is today it should change the information inside the date and time input to “Today” plus the time.

I would also like to add a real burger menu with different links and a nicer looking page for the successful submit.

Regarding general feedback, As I have written, I found confusing the documentation for the POST API endpoint, as there were inconsistencies between it and the data.json file.

Also, the linter running when committing with git was something hard to figure out. Mainly regarding the rule for react/prop-types.
