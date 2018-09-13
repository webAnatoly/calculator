import errors from '@google-cloud/error-reporting'
import config from './../config'

// Instantiates a client
const errorReporter = errors({
  // Sends errors both in DEV and PRODUCTION modes
  ignoreEnvironmentCheck: true,
  reportUnhandledRejections: true,
  keyFilename: config.GOOGLE_APPLICATION_CREDENTIALS
})

export default errorReporter
