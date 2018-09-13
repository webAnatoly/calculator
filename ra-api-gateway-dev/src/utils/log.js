import config from '../config'
import moment from 'moment-timezone'
import errorReporter from '../utils/errorReporter'
import logReporter, { LogSeverity } from '../utils/logReporter'
const tz = 'America/New_York'

const now = () =>
  moment()
    .tz(tz)
    .format('MM/DD, hh:mm:ss a')

export default {
  info: async text => {
    // The metadata associated with the entry
    const metadata = {
      resource: { type: 'project' },
      severity: LogSeverity.INFO
    }
    // Prepares a log entry
    const entry = logReporter.entry(metadata, text)
    try {
      await logReporter.write(entry)
      console.log(`${now()} | INFO ${text}`)
    } catch (error) {
      console.error('ERROR:', text)
    }
  },
  debug: async text => {
    if (config.logLevel === 'DEBUG') {
      // The metadata associated with the entry
      const metadata = {
        resource: { type: 'project' },
        severity: LogSeverity.DEBUG
      }
      // Prepares a log entry
      const entry = logReporter.entry(metadata, text)
      try {
        await logReporter.write(entry)
        console.log(`${now()} | DEBUG ${text}`)
      } catch (error) {
        console.error('ERROR:', text)
      }
    }
  },
  err: async text => {
    // The metadata associated with the entry
    const metadata = {
      resource: { type: 'project' },
      severity: LogSeverity.ERROR
    }
    // Prepares a log entry
    const entry = logReporter.entry(metadata, text)
    try {
      await logReporter.write(entry)
      console.log(`${now()} | ERR ${text}`)
    } catch (error) {
      console.error('ERROR:', text)
    }
    errorReporter.report(text)
  }
}
