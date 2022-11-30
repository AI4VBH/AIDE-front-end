<!--
  ~ Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
-->

# Accessibility statement for AIDE

This accessibility statement applies to the AI Centre for Value Based Healthcare website AIDE.

This website is run by the AI Centre for Value Based Healthcare. We want as many people as possible to be able to use this website. For example, that means you are able to:

- Zoom in up to 300% without the text spilling off the screen
- Navigate most of the website using just a keyboard
- Navigate most of the website using speech recognition software
- Listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)

[AbilityNet](https://mcmw.abilitynet.org.uk/) has advice on making your device easier to use if you have a disability.

## How accessible this website is

We know that some parts of this website are not fully accessible:
For example:

- Clinical Review DICOM viewer cannot be operated by Keyboard alone.
- Unable to access some radio buttons and checkboxes across the site via Keyboard.
- Some column headers are missing labels which may mean that a screen reader is ineffective on some tables.
- Colour contrast is insufficient on some input fields and table headers.


## Reporting problems with this website

We’re always looking to improve the accessibility of this website. If you find any problems not listed on this page or think we’re not meeting accessibility requirements, please contact us.


## Enforcement procedure

The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint, contact the [Equality Advisory and Support Service (EASS)](https://www.equalityadvisoryservice.com/).


## Technical information about this website’s accessibility

The AI Centre for Value Based Healthcare is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.

### Compliance status

This website is partially compliant with the [Web Content Accessibility Guidelines version 2.1](https://www.w3.org/TR/WCAG21/) AA standard.

### Non-accessible content

Despite our best efforts to ensure accessibility of AIDE, there may be some limitations. Below is a description of known limitations:

| Page | Issues | Type | Impact |
|------|--------|------|--------|
| Admin page - System Statistics | No column header above the first column in the 'Issues' table containing the checkboxes | Explicit labelling - WAVE | Unable to use a screen reader to describe what this column is used for |
| Admin page - System Statistics | Unable to access the checkboxes by tabbing to them | Keyboard accessibility - WAVE | Individuals using only a keyboard will be unable to select or un-select any checkbox |
| Payload page - Payload table | No text on the far left column which contains the drop-down/expansion symbols | Explicit labelling - WAVE | Unable to use a screen reader to describe what this column is used for |
| Payload page - Payload table | "A button is empty or has no text" - Error next to all three drop-down/expansion symbols | Explicit labelling - WAVE | Unable to use a screen reader to describe what this column is used for |
| All pages with pagination | Pagination has a nested interactive element | Nested-interactive - AXE | Ensures interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies |
| All pages with a modal | Unable to add an aria-label on the whole modal component because vuetify does not allow it | Aria-dialog-name - Axe | Serious - Ensures every ARIA dialog and alertdialog node has an accessible name |
| All pages | Colour contrast - Placeholder text for input fields | Insufficient color contrast - Axe | Serious |
| All pages with pagination | Colour contrast on rows per page dropdown | Insufficient color contrast - Axe | Serious |
| Workflow editor page | Element contains only non-text characters - the error is shown for the little expansion arrows within the text editor | Insufficient color contrast - Axe | Serious |
| Workflow editor page | Aria-label error for the Editor - unable to change as it is an inbuilt vuetify library which errors if we change | Aria-input-field-name | Serious |
| Payload page - Payload table | Unable to access the radio buttons by tabbing to them | Keyboard accessibility - WAVE | Individuals using only a keyboard will be unable to select radio buttons |


##  Disproportionate burden

We believe that our approach to carrying out accessibility checks is reasonable.

However, the accessibility regulations say that we don't need to make all elements on a website accessible, if doing so would impose a disproportionate burden on us.

Under assessment we feel that the Clinical Review DICOM viewer falls under this section with regards to the technology it is built in and the additional effort it would take to extract that functionality to make it accessible.

## Browser and device compatibility

AIDE is designed to be compatible with the following browsers running on a minimum of 1000px width:

- Sarafi
- Edge
- Chrome
- Firefox

AIDE is not compatible with:

- Browsers older than 2 major versions
- Mobile device browsers

## Preparation of this accessibility statement

This statement was prepared on 30-Nov-2022. It was last reviewed on 30-Nov-2022.
This website was last tested on 30-Nov-2022. The test was carried out by the AI Centre for Value Based Healthcare. We tested all pages.

We also carried out automated and technical testing to check the website’s code and content against the WCAG criteria.

We carried out usability testing to make sure the website can be navigated using a keyboard and the following assistive technologies: Voiceover, NVDA and Zoomtext.
