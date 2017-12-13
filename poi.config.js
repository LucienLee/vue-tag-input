const componentName = 'VueTagAutocomplete';

const camelToKebab = str => str
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`);

module.exports = options => {
  const { mode, component } = options;

  const basic = {

  };

  if (options.mode === 'development') {
    return {
      ...basic,
      entry: './index.js',
    };
  }

  if (options.mode === 'test') {
    return {
      presets: [
        require('poi-preset-transform-test-files')(),
      ]
    }
  }

  // production, build as component
  return {
    ...basic,
    entry: {
      [camelToKebab(componentName)]: `./src/${componentName}.vue`
    },
    filename: {
      js: '[name].js',
      css: '[name].css'
    },
    presets: [
      require('poi-preset-eslint')(),
    ],
    html: false,
    moduleName: componentName,
    extractCSS: !options.component,
    component: options.component,
  };
};
