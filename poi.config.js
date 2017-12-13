const componentName = 'VueTagAutocomplete';

const camelToKebab = str => str
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`);

module.exports = (options = {}) => {
  const { mode, component } = options;

  const basic = {
  };

  if (mode === 'development') {
    return {
      ...basic,
      entry: './index.js',
    };
  }

  if (mode === 'test') {
    return {
      ...basic,
      presets: [
        require('poi-preset-transform-test-files')(),
      ]
    }
  }

  // production, build as component
  return {
    ...basic,
    entry: {
      [`${component ? '' : 'umd/'}${camelToKebab(componentName)}`]: `./src/${componentName}.vue`
    },
    filename: {
      js: '[name].js',
      css: '[name].css'
    },
    presets: [
      require('poi-preset-eslint')(),
    ],
    html: false,
    extractCSS: !component,
    moduleName: componentName,
  };
};
