import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import url from 'url'; // for parsing GET
import initializeDb from './db'
import config from './config'
import socket from './socket'
import errorReporter from './utils/errorReporter'

let app = express()
app.server = http.createServer(app)

if (__DEV__) {
  app.server = http.createServer(app)
} else {
  // https should be here
  app.server = http.createServer(app)
}

// logger
app.use(morgan('dev'))

app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
)

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
)

app.use(errorReporter.express)
// connect to db
initializeDb(db => {
  // internal middleware
  app.server.listen(config.port, () => {
    socket(app.server, config.port, config.hostname, db)
    console.log(
      `Started ${__DEV__
        ? 'DEV'
        : 'PROD'} environment on port ${app.server.address().port}`,
      __DEV__ ? `\nconfig: ${JSON.stringify(config, null, 2)}` : ''
    )
  })
})

/*
В GET запросе сервер получает JSON вида {"+": [2,3]} где ключ это знак операции, массив из двух чисел это операнды
Парсит JSON.
Выполняет операцию над числами в зависимости от знака.
Возвращает результат.
*/
app.server.on('request', function (req, res) {
  const urlParsed = url.parse(req.url, true)
  let answer = 'no answer';

  if (urlParsed.pathname === '/' && urlParsed.query.data) {
    const obj = JSON.parse(urlParsed.query.data)
    let operator;
    // определить оператор
    Object.entries(obj).forEach(item => {
      if ('*/+-'.indexOf(item[0]) !== -1) { operator = item[0] }
    })
    // выполнить операцию в зависимости от оператора
    if (operator) {
      switch (operator) {
        case '*': answer = obj['*'][0] * obj['*'][1]; break;
        case '/': answer = obj['/'][0] / obj['/'][1]; break;
        case '+': answer = obj['+'][0] + obj['+'][1]; break;
        case '-': answer = obj['-'][0] - obj['-'][1]; break;
        default: 
          answer = 'no answer'
      }
    } else {
      answer = 'no operator';
    }
  } /* (urlParsed.pathname === '/' && urlParsed.query.data) */ else {
    answer = 'no data'
  }
  res.end(String(answer))
})

export default app
