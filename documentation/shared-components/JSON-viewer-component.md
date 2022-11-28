<!--
  ~ Copyright 2022 Crown Copyright
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

# Table of Contents
1. [Overview](#overview)
2. [Component props](#component-props)

# Overview
- Uses [vanilla-jsoneditor library](https://openbase.com/js/vanilla-jsoneditor/documentation).
- JSON viewer component is used to display JSON data to the user.
- It's available in `display` and `edit` modes.
- Has an inbuilt JSON validator.
&nbsp;
![image](../static/JSON-viewer.png)

# Component-props
- `content: Content` - JSON data to be displayed. Contents is an object containing a property json and text. Only one of the two must be defined.
- `mode: 'tree' | 'text'` - 'tree' (default) | 'text'.
- `mainMenuBar: boolean` - default value is 'true'.
- `navigationBar: boolean` - default value is 'true'.
- `statusBar: boolean` - default value is 'true'.
- `readOnly: boolean` - default value is 'false'.
- `indentation: number | string` - number of spaces for indentation when stringifying JSON.
- `tabSize: number` - default value is 4 (only applicable to text mode).
- `escapeControlCharacters: boolean` - default value is 'false' (only applicable to tree mode).
- `escapeUnicodeCharacters: boolean` - default value is 'true'.
- `validator: function (json: JSONData): ValidationError[]` - validate JSON document.
- `onError(err: Error)` - callback fired when an error occurs.
- `onChange(content: Content, previousContent: Content, changeStatus: { contentErrors: ContentErrors, patchResult: JSONPatchResult | null })` - callback invoked when a change happens.
- `onChangeMode(mode: 'tree' | 'text')` - callback invoked when the mode is changed.
- `onClassName(path: Path, value: any): string | undefined` - add custom class name to specific nodes.
- `onRenderValue(props: RenderValueProps) : RenderValueComponentDescription[]` - customise rendering of the values.
- `onRenderMenu(mode: 'tree' | 'text', items: MenuItem[]) : MenuItem[] | undefined` - callback which can be used to make changes to menu items.
- `queryLanguages: QueryLanguage[]` - configure one or multiple query language that can be used in the Transform modal
- `queryLanguagesId` - id of currently selected query language.
- `onChangeQueryLanguage: (queryLanguageId: string) => void` - callback invoked when user changes selected query language.
- `onFocus()` - callback invoked when editor gets focus.
- `onBlur()` - callback invoked when editor loses focus.
