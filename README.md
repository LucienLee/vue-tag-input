# Vue Tag Autocomplete
customizable [Vue](https://vuejs.org) component for inputing tags, which support autocomplete.

## Getting Started

```bash
npm install --save vue-tag-autocomplete // OR
yarn add vue-tag-autocomplete
```

### Quick Example

```html
<VueTagAutocomplete v-model="tags" :quickMode="true"></VueTagAutocomplete>
```

```js
import VueTagAutocomplete from 'vue-tag-autocomplete'

export default {
  data () {
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
An array of suggestions that are used as basis for showing suggestions. Each tag need an `id` and a `text` property which is used to display. Otherwise, you could just use array of strings directly. This component would generate id by index and string automatically. 

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
Allow developers to use `v-model`, rather than handling `add` and `delete` event by yourselves. In quick mode, new tag will append to array as `string`. If you want to control how new tag be added, you could listen `input` event. Otherwise, you should not use `quickMode` and listen `add` event. 

```html
<VueTagAutocomplete
  :quickMode="true"
  v-model="tags"
/>
<!-- Which is equal to -->
<VueTagAutocomplete
  :quickMode="true"
  :value="tag"
  @input="val = { tag = val }"
/>
```

#### placeholder - {String}
Defaults to `Add new tags`  
The placeholder shown for the input. 

#### delimiters - {Array<Integer>}
Default: [9, 13] (Tab and return keys)  
Array of integers matching keyboard event `keyCode` values. When a corresponding key is pressed, the preceding string is finalised as tag.

#### delimiterChars - {Array<String>}
Default: [',']  
Array of characters matching keyboard event key values. This is useful when needing to support a specific character irrespective of the keyboard layout. Note, that this list is separate from the one specified by the delimiters option, so you'll need to set the value there to [], if you wish to disable those keys. 

#### allowNew - {Boolean}
Default: `false`  
Allows users to add new (not suggested) tags. If it's `false`, the duplicated tag would play animation with `errorAninmatedClass`.

#### allowDuplicated - {Boolean}
Default: `false`  
Allows users to add duplicated tags.

#### addOnBlur - {Boolean}
Default: `false`  
Add tag automatically when input field blur.

#### errorAninmatedClass
Default: `error` (scoped css)
The animation class would add on duplicated tag element when `allowNew` is `false`. The default animation is shaking for 0.25s.

## Events

#### add

#### delete

#### inputChange

#### input


## Development

## Author


