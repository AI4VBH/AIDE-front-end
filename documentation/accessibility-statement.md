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

- Zoom in up to 200% without the text spilling off the screen
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

Email us at [ai4vbh@kcl.ac.uk](mailto:ai4vbh@kcl.ac.uk)


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
<!-- | System dashboard - Issues table | No column header above the first column in the 'Issues' table containing the checkboxes | Explicit labelling - WAVE | Unable to use a screen reader to describe what this column is used for | -->
| System dashboard - Issues table | Unable to access the checkboxes using a screen reader or a keyboard | Keyboard accessibility / Screen reader | Individuals using only a keyboard will be unable to select or un-select any checkbox or hear a screen reader describe them |
| Payload dashboard - Payload table | No column header for the expansion icons column on the right side of the table | Explicit labelling / Screen reader | The screen reader can not describe that column |
| Payload dashboard - Payload table | The expansion icons can be selected to open the payloads via the keyboard, however this cannot be done when using the keyboard whilst using a screen reader | Explicit labelling / Screen reader | Unable to use a screen reader and keyboard to open the payloads |
| Workflows - Workflow editor | Two colour contrast issues on the page | Insufficient colour contrast | Insufficient colour contrast reduces the ability of vision impaired users to read the site |
| Workflows - Workflow editor | Due to this being a JSON editor, the 'tab' button is used to edit rather than for navigation | Keyboard accessibility | Keyboard only users would not be able to exit the JSON editor |
| All pages with a modal | Unable to add an aria-label on the whole modal component because vuetify does not allow it | Aria-dialog-name | Screen-readers may not describe the modal upon opening |
| All pages with a dropdown | Unable to access any dropdown using only the keyboard because vuetify will not allow it | Keyboard accessibility | keyboard-only users will not be able to access or select elements in drop-downs across the site |


##  Disproportionate burden

We believe that our approach to carrying out accessibility checks is reasonable.

However, the accessibility regulations say that we don't need to make all elements on a website accessible, if doing so would impose a disproportionate burden on us. Under assessment we feel that the Clinical Review DICOM viewer falls under this section with regards to the technology it is built in and the additional effort it would take to extract that functionality to make it accessible.

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
