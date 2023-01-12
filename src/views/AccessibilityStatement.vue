<!--
  Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <v-container>
        <section>
            <h1>Accessibility statement for AIDE</h1>
            <p>
                This accessibility statement applies to the AI Centre for Value Based Healthcare
                website AIDE.
            </p>
            <p>
                This website is run by the AI Centre for Value Based Healthcare. We want as many
                people as possible to be able to use this website. For example, that means you are
                able to:
            </p>
            <ul>
                <li>View all text when zoomed in up to 200% using a scroll</li>
                <li>Navigate most of the website using just a keyboard</li>
                <li>Navigate most of the website using speech recognition software</li>
                <li>
                    Listen to most of the website using a screen reader (including the most recent
                    version of NVDA)
                </li>
            </ul>
            <p>
                <a href="https://mcmw.abilitynet.org.uk/">AbilityNet</a> has advice on making your
                device easier to use if you have a disability.
            </p>
        </section>

        <section>
            <h2>How accessible this website is</h2>
            <p>We know that some parts of this website are not fully accessible. For example:</p>
            <ul>
                <li>Clinical Review page is not accessible.</li>
                <li>
                    Some column headers are missing labels which may mean that a screen reader is
                    ineffective on some tables.
                </li>
                <li>Colour contrast is insufficient on some input fields and table headers.</li>
            </ul>
        </section>

        <section>
            <h2>Reporting problems with this website</h2>
            <p>
                We're always looking to improve the accessibility of this website. If you find any
                problems not listed on this page or think we're not meeting accessibility
                requirements, please contact us.
            </p>
            <p>Email us at: <a href="mailto:ai4vbh@kcl.ac.uk">ai4vbh@kcl.ac.uk</a></p>
        </section>

        <section>
            <h2>Enforcement procedure</h2>
            <p>
                The Equality and Human Rights Commission (EHRC) is responsible for enforcing the
                Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility
                Regulations 2018 (the 'accessibility regulations'). If you're not happy with how we
                respond to your complaint, contact the
                <a href="https://www.equalityadvisoryservice.com/"
                    >Equality Advisory and Support Service (EASS)</a
                >.
            </p>
        </section>

        <section>
            <h2>Technical information about this website's accessibility</h2>
            <p>
                The AI Centre for Value Based Healthcare is committed to making its website
                accessible, in accordance with the Public Sector Bodies (Websites and Mobile
                Applications) (No. 2) Accessibility Regulations 2018.
            </p>
            <h3>Compliance status</h3>
            <p>
                This website is partially compliant with the
                <a href="https://www.w3.org/TR/WCAG21/"
                    >Web Content Accessibility Guidelines version 2.1</a
                >
                AA standard.
            </p>
            <h3>Non-accessible content</h3>
            <p>
                Despite our best efforts to ensure accessibility of AIDE, there may be some
                limitations. Below is a description of known limitations:
            </p>
            <v-simple-table>
                <thead>
                    <tr>
                        <th>Page</th>
                        <th>Issues</th>
                        <th>Type</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Issues table</td>
                        <td>Unable to access the checkboxes using a screen reader or a keyboard</td>
                        <td>Keyboard accessibility / Screen reader</td>
                        <td>
                            Individuals using only a keyboard will be unable to select or un-select
                            any checkbox or hear a screen reader describe them
                        </td>
                    </tr>
                    <tr>
                        <td>Payload table</td>
                        <td>
                            No column header for the expansion icons column on the right side of the
                            table
                        </td>
                        <td>Explicit labelling / Screen reader</td>
                        <td>The screen reader can not describe that column</td>
                    </tr>
                    <tr>
                        <td>Payload table</td>
                        <td>
                            The expansion icons can be selected to open the payloads via the
                            keyboard, however this cannot be done when using the keyboard whilst
                            using a screen reader
                        </td>
                        <td>Explicit labelling / Screen reader</td>
                        <td>Unable to use a screen reader and keyboard to open the payloads</td>
                    </tr>
                    <tr>
                        <td>Workflow editor</td>
                        <td>Two colour contrast issues on the page</td>
                        <td>Insufficient colour contrast</td>
                        <td>
                            Insufficient colour contrast reduces the ability of vision impaired
                            users to read the site
                        </td>
                    </tr>
                    <tr>
                        <td>Workflow editor</td>
                        <td>
                            Due to this being a JSON editor, the 'tab' button is used to edit rather
                            than for navigation, and therefore cannot be used to exit the editor
                        </td>
                        <td>Keyboard</td>
                        <td>Keyboard-only users would not be able to exit the JSON editor</td>
                    </tr>
                    <tr>
                        <td>All pages with a modal</td>
                        <td>
                            Unable to add an aria-label on the whole modal component because Vuetify
                            does not allow it
                        </td>
                        <td>Aria-dialog-name</td>
                        <td>Screen-readers may not describe the modal upon opening</td>
                    </tr>
                    <tr>
                        <td>All pages with a dropdown</td>
                        <td>
                            Unable to access any dropdown using only the keyboard because Vuetify
                            will not allow it
                        </td>
                        <td>Keyboard</td>
                        <td>
                            Keyboard-only users will not be able to select elements in drop-downs
                            across the site
                        </td>
                    </tr>
                    <tr>
                        <td>All pages when zoomed in</td>
                        <td>
                            Page title disappears when the page is zoomed in at 200% on a 1000px
                            width screen.
                        </td>
                        <td>Perceivability / vision-impaired users</td>
                        <td>
                            Vision impaired users may not know the title of the page they are on
                        </td>
                    </tr>

                    <tr>
                        <td>Clinical review page when zoomed in</td>
                        <td>
                            Usability of the page is highly degraded when zoomed in at 150% on a
                            1000px width screen.
                        </td>
                        <td>Perceivability / vision-impaired users</td>
                        <td>
                            Vision impaired users may not be able to use the clinical review screen
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </section>

        <section>
            <h2>Disproportionate burden</h2>
            <p>We believe that our approach to carrying out accessibility checks is reasonable.</p>
            <p>
                However, the accessibility regulations say that we don't need to make all elements
                on a website accessible, if doing so would impose a disproportionate burden on us.
                Under assessment we feel that the Clinical Review page falls under this section with
                regards to the components and technologies it is built in and the additional effort
                it would take to extract that functionality to make it accessible.
            </p>
        </section>

        <section>
            <h2>Browser and device compatibility</h2>
            <p>
                AIDE is designed to be compatible with the following browsers running on a minimum
                of 1000px width:
            </p>
            <ul>
                <li>Sarafi</li>
                <li>Edge</li>
                <li>Chrome</li>
                <li>Firefox</li>
            </ul>
            <p>AIDE is not compatible with:</p>
            <ul>
                <li>Browsers older than 2 major versions</li>
                <li>Mobile device browsers</li>
            </ul>
        </section>

        <section>
            <h2>Preparation of this accessibility statement</h2>
            <p>
                This statement was prepared on {{ statementPreparedDate | formatDate }}. It was last
                reviewed on {{ statementLastReviewedDate | formatDate }}. This website was last
                tested on {{ websiteLastTestedDate | formatDate }}. The test was carried out by the
                AI Centre for Value Based Healthcare.
            </p>
            <p>
                We carried out automated and technical testing on all pages to check the website’s
                code and content against the WCAG criteria.
            </p>
        </section>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate } from "@/utils/date-utilities";

export default defineComponent({
    metaInfo: {
        title: "Accessibility Statement",
    },
    filters: {
        formatDate,
    },
    data() {
        return {
            statementPreparedDate: "2022-11-30T00:00:00",
            statementLastReviewedDate: "2023-01-11T00:00:00",
            websiteLastTestedDate: "2023-01-11T00:00:00",
        };
    },
});
</script>

<style scoped>
section {
    margin-top: 20px;
}

ul {
    margin-bottom: 16px;
}

p a {
    color: #1867c0;
    font-weight: bold;
}
</style>
