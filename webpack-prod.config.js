const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'docs')
  }
};