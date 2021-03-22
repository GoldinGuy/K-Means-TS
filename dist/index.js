
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./kmeans-ts.cjs.production.min.js')
} else {
  module.exports = require('./kmeans-ts.cjs.development.js')
}
