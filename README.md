# Vue Tag Input
[![Travis](https://img.shields.io/travis/LucienLee/vue-tag-input.svg)](https://travis-ci.org/LucienLee/vue-tag-input/) [![npm](https://img.shields.io/npm/v/vue-tag-input.svg)](https://www.npmjs.com/package/vue-tag-input) [![Style Guide](https://img.shields.io/badge/Vue%20Style%20Guide-Recommended-brightgreen.svg)](https://vuejs.org/v2/style-guide)

Customizable [Vue](https://vuejs.org) component for tag input, which support autocomplete.


## Getting Started

### Install

Recommand intall from CLI:

```bash
npm install --save vue-tag-input // OR
yarn add vue-tag-input
```

If you want to include script directly:

```html
<!-- Load Script --> 
<script src="https://cdn.jsdelivr.net/npm/vue-tag-input/dist/umd/vue-tag-input.js"></script>

<!-- Load Style --> 
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/vue-tag-input/dist/umd/vue-tag-input.css">
```

### Quick Example

```html
<template>
  <VueTagInput v-model="tags" :quick-mode="true"></VueTagInput>
</template>

<script>
import VueTagInput from 'vue-tag-input'

export default {
  data() {
    return {
      tags: [
        'Africa',
        'Taiwan'
      ]
    }
  },
  components: {
    VueTagInput
  }
}
</script>
```

## Usage

```

```

## Props

#### tags - {Array<Object|String>} (required) 
An array of tag objects. Each tag need an `id` and a `text` property which is used to display. Otherwise, you could just use array of strings directly. This component would generate id by index and string automatically. 

```js
// Recommended: Pass Object 
[
  {id: 1, text: 'Apple'},
  {id: 2, text: 'Banana'},
  ...
]
// Quick: Pass String 
[
  'Apple',
  'Banana',
  ...
]
//
```

#### suggestions - {Array<Object|String>}
Default: `[]`  
An array of suggestions that are used as basis for showing autocomplete. Each tag need an `id` and a `text` property which is used to display. Otherwise, you could just use array of strings directly. This component would generate id by index and string automatically. 

```js
// Recommended: Pass Object 
[
  {id: 1, text: 'Apple'},
  {id: 2, text: 'Banana'},
  ...
]
// Quick: Pass String 
[
  'Apple',
  'Banana',
  ...
]
//
```
#### quickMode - {Boolean}
Default: `false`  
Allow developers to use `v-model`, rather than handling `add` and `delete` event by yourselves. In quick mode, new tag will append to array as `string`. If you want to control how new tag be added, you could listen [`change`](#change) event. Otherwise, you should listen [`add`](#add) and [`delete`](#delete) event instead. 

```html
<VueTagInput
  :quick-mode="true"
  v-model="tags"
/>
<!-- Which is equal to -->
<VueTagInput
  :quick-mode="true"
  :tags="tags"
  @change="val = { tags = val }"
/>
```
#### id - {String}
Defaults to `''`  
id attribute on `<input/>`. Recommanded to assign id for identity and associate with label.

```html
<label for="email"></label>
<VueTagInput :id="email" />
```

#### placeholder - {String}
Defaults to `'Add new tags'`  
The placeholder shown for the input. 

#### delimiters - {Array<Integer>}
Default: [9, 13] (Tab and return keys)  
Array of integers matching keyboard event `keyCode` values. When a corresponding key is pressed, the preceding string is finalised as tag.

#### delimiterChars - {Array<String>}
Default: [',']  
Array of characters matching keyboard event key values. This is useful when needing to support a specific character irrespective of the keyboard layout. Note, that this list is separate from the one specified by the delimiters option, so you'll need to set the value there to [], if you wish to disable those keys. 

#### onlyFromSuggestions - {Boolean}
Default: `false`  
If set to `true`, it will be possible to add new items only from the autocomplete dropdown.

#### allowDuplicated - {Boolean}
Default: `false`  
Allows users to add duplicated tags. If it's `false`, the duplicated tag would play animation with [`errorAninmatedClass`](#errorAninmatedClass---String) to hint the user.

#### addOnBlur - {Boolean}
Default: `false`  
Add tag automatically when input field blur.

#### maxSuggestionsLength - {Number}
Default: `Infinity`  
Maximum number of suggestions to display.

#### errorAninmatedClass - {String}
Default: `error`
The animation class would add on duplicated tag element when [`allowDuplicated`](#allowDuplicated---{Boolean}) is `false`. The default animation is shaking for 0.25s.

#### tagStyle - {Object|Function}
Default: `{}`
The style object would be applied on the tag. Besides passing plain object, you can pass a function which return style object to assign conditional style. The function would recieve each element in `tags` as params. See the example below: 


```html
<!-- Conditional highlight: Add highlight property in each tag to determine the background color -->
<template>
  <VueTagInput
    :tags="tags"
    :tagStyle="tagComputedStyle"
  />
</template>

<script>
export default {
  data() {
    return {
      tags: [{
        id: 1,
        text: 'javascript',
        highlight: true
      }, {
        id: 2,
        text: 'css',
        highlight: false
      }, {
        id: 3,
        text: 'html',
        highlight: true
      }]
    }
  },
  methods: {
    tagComputedStyle(item) {
      // If item has highlight is true, the background would be aquamarine color. Otherwise it's grey.
      return item.highlight ? { backgroundColor: 'Aquamarine' } : { backgroundColor: 'grey' }
    }
  }
}
</script>
```

#### preventDefaultOnEnter - {Boolean}
Default: `false`  
Prevent default when user tap ENTER to avoid the form submission.

## Events

#### add
Params: tag would be added - {String}  
Emitted when a tag had be added.

```html
<template>
  <VueTagInput :tags="tags" @add="onAdd"></VueTagInput>
</template>

<script>
export default {
  data() {
    return { tags: [] }
  },
  methods: {
    onAddition(tag) {
      this.tags.push(tag)
    }
  }
}
</script>
```

#### delete
Params: index of tag would be removed - {Number}  
Emitted when a tag had be added.

```html
<template>
  <VueTagInput :tags="tags" @delete="onDelete"></VueTagInput>
</template>

<script>
export default {
  data() {
    return { tags: [] }
  },
  methods: {
    onDelete(index) {
      this.tags.splice(index, 1)
    }
  }
}
</script>  
```

#### change
Params: the array of updated tags - {Array}  
Emitted when a tag had be added or deteled, which only be available in [`quickMode`](#quickMode---Boolean). The new tag will be appended as string into array. If you need to control new tag in the array, you could modify the last item of array and pass the whole array to `data` in the listener.

```js
export default {
  data() {
    return { tags: [] }
  },
  methods: {
    onInput(newTags) {
      // newTags will contained the new array of updated tags. 
      const id = newTags.length - 1
      const text = newTags.pop()
      this.tags = [...newTags, {
        id,
        text
      }]
    }
  }
}
```

#### inputChange
Parmas: the current input data - {String}  
Emitted when input field is changed. You could query autocomplete data here.

```js
export default {
  data() {
    return { 
      tags: [],
      suggestions: []
    }
  },
  methods: {
    onInputChange(query) {
      fetch(`https://your.data.source?query=${query}`, (data) => {
        this.suggestions = data
      })
    }
  }
}
```

#### focus
Emitted when input is focused

#### blur
Emitted when input is Blur

## Style
class names

- 

## Development

```bash
# Run development enviroment
npm start 

# Bundle test file and test it with Jest
npm run test

# Bundle test file and update test snapshot 
npm run test:update

# Examine code style with eslint
npm run lint

# Fix eslint automatically
npm run lint:fix 

# Bundle component module 
npm run build

```

## Author
Lucien Lee

## License
MIT
