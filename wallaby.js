module.exports = function (wallaby) {
  //noinspection JSUnusedGlobalSymbols,JSUnresolvedFunction
  return {
    bootstrap: function () {
      require('expectations');
    },

    files: [
      {pattern: 'test/**'},
      {pattern: 'src/**/*.ts'},
      {pattern: 'src/**/*.json'},
      {pattern: 'src/**/*.yaml'},
      {pattern: 'src/**/*.spec.ts', ignore: true}
    ],

    tests: [
      {pattern: 'src/**/*.spec.ts'}
    ],

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({module: 1, target: 2})
    },

    env: {
      type: 'node',
      runner: 'node',
      params: {
        runner: '--harmony --harmony_default_parameters --harmony_destructuring'
      }
    }
  };
};
