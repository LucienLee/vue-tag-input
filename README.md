# Vue Tag Autocomplete
Customizable [Vue](https://vuejs.org) component for inputing tags, which support autocomplete.

## Getting Started

```bash
npm install --save vue-tag-autocomplete // OR
yarn add vue-tag-autocomplete
```

### Quick Example

```html
<template>
  <VueTagAutocomplete v-model="tags" :quickMode="true"></VueTagAutocomplete>
</template>

<script>
import VueTagAutocomplete from 'vue-tag-autocomplete'

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
    VueTagAutocomplete
  }
}
</script>
```

## Usage

```

```

## Props

#### value - {Array<Object|String>} (required) 
An array of tag objects. Each tag need an `id` and a `text` property which is used to display. Otherwise, you could just use array of strings directly. This component would generate id by index and string automatically. 

```js
// Recommended: Pass Object 
[
  {id: 1, name: 'Apple'},
  {id: 2, name: 'Banana'},
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
  {id: 1, name: 'Apple'},
  {id: 2, name: 'Banana'},
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
Allow developers to use `v-model`, rather than handling `add` and `delete` event by yourselves. In quick mode, new tag will append to array as `string`. If you want to control how new tag be added, you could listen [`input`](#input) event. Otherwise, you should listen [`add`](#add) and [`delete`](#delete) event instead. 

```html
<VueTagAutocomplete
  :quickMode="true"
  v-model="tags"
/>
<!-- Which is equal to -->
<VueTagAutocomplete
  :quickMode="true"
  :value="tags"
  @input="val = { tags = val }"
/>
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

#### errorAninmatedClass - {String}
Default: `error` (scoped css)
The animation class would add on duplicated tag element when `allowNew` is `false`. The default animation is shaking for 0.25s.

## Events

#### add
Params: tag would be added - {String}  
Emitted when a tag had be added.

```html
<template>
  <VueTagAutocomplete :value="tags" @add="onAdd"></VueTagAutocomplete>
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
  <VueTagAutocomplete :value="tags" @delete="onDelete"></VueTagAutocomplete>
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

#### input
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
Emitted when input field changed. You could query autocomplete data here.

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

## Development

## Author
Lucien Lee

