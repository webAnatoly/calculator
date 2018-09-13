const { STACKDRIVER_API_KEY } = process.env
const { projectId } = process.env
const { TRACKING_ID } = process.env

/* private config items, like keys(e.g. - STACKDRIVER_API_KEY) you can put in .env file */
let config = {
  apiServerAddress: 'http://localhost:8080',
  /* these keys one can obtain from google credentials json key with stackdriver permissions */
  STACKDRIVER_API_KEY,
  projectId,
  /* that key one can obtain from analytics.google.com */
  TRACKING_ID
}

export default config
