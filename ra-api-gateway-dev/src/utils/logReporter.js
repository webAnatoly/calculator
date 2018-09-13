import Logging from '@google-cloud/logging'
import config from '../config'

export const LogSeverity = {
  DEFAULT: 0,
  DEBUG: 100,
  INFO: 200,
  NOTICE: 300,
  WARNING: 400,
  ERROR: 500,
  CRITICAL: 600,
  ALERT: 700,
  EMERGENCY: 800
}
// Instantiates a client
const logging = new Logging({
  projectId: config.stackdriverProjectId
})

const logName = config.stackdriverProjectId
// Selects the log to write to
const logReporter = logging.log(logName)

export default logReporter
