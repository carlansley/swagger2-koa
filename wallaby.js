module.exports = (wallaby) => ({
  files: [
    {pattern: 'test/**'},
    {pattern: 'src/**/*.ts'},
    {pattern: 'src/**/*.json'},
    {pattern: 'src/**/*.yaml'},
    {pattern: '.travis.yml'},
    {pattern: 'src/**/*.spec.ts', ignore: true}
  ],

  tests: [
    {pattern: 'src/**/*.spec.ts'}
  ],

  compilers: {
    '**/*.ts': wallaby.compilers['typeScript']({module: 1, target: 2})
  },

  env: {
    type: 'node',
    runner: 'node'
  }
});
