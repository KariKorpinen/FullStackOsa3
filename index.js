const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(bodyParser.json())
//app.use(morgan('combined', {function (req, res){return res}}))
//app.use(morgan.token('type', function (req, res) { return req.headers['content-type'] }))
//app.use(morgan('dev', {
//  function (req, res) { return res.statusCode < 400 }
//}))
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
//app.use(morgan('tiny', { stream: accessLogStream}))
//morgan.token('body', function getBody (req) {
//  return req.body
//})
//app.use(morgan('tiny'))
//app.use(morgan(':method :url :status :req[content-type] :res[content-length] - :response-time ms'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    //tokens.body(req, res),
    JSON.stringify(req.body),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

const generateRandomId = () => {
    //const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
    return getRandomInt(1, 10000)
}
const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

let phones = [
    {
       name: 'Tor Hellas',
       number: '040-122231',
       id: 1
    },
    {
       name: 'Matti Tienari',
       number: '040-122232',
       id: 2
    },
    {
       name: 'Arttu Järvinen',
       number: '040-122233',
       id: 3
    },
    {
       name: 'Leena Kutvonen',
       number: '040-122234',
       id: 4
    }
  ]

  app.get('/api/persons', (req, res) => {
    res.json(phones)
 })

 app.get('/info', (req, res) => {
    const lengt = phones.length
    //const respons =('<p>phones pituus', lengt, '</p>')
    //const respons =('<p>puhelinluettelossas </p>', lengt)
    //console.log('<p>phones pituus', lengt, '</p>')
    //console.log(respons) 
    res.send('<p>puhelinluettelossa ' + phones.length + ' henkilön tiedot</p><p>' + Date() +'</p>')
    //res.end(respons)
   
    
    //res.json(JSON.stringify(respons))
 })

 app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //const note = notes.find(note => {
    //   console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    //   return note.id === id
    //})
    const note = phones.find(note => note.id === id)
  
    if ( note ) {
      response.json(note)
    } else {
      response.status(404).end()
    }
 })

 app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body) 
    console.log(body)
      
    if (body === undefined) {  
      return response.status(400).json({error: 'content missing'})
    }
      
    if (!body.name) {
      return response.status(400).json({error: 'name missing'})
    }
    
    if (!body.number) {  
      return response.status(400).json({error: 'number missing'})
    }
    
    const name2 = body.name
    
    var i = null
    var findName = 0
    for (i = 0; phones.length > i; i += 1) {
        if (phones[i].name === name2) {
            findName= findName+1
            console.log("nimi löyty")
        }
    }
    
    if (findName > 0) {
      return response.status(400).json({error: 'name must be unique'})
    }
  
    const note = {
      name: body.name,
      number: body.number,
      id: generateRandomId()
    }
    
    phones = phones.concat(note)
    console.log(phones)
  
    response.json(note)
  })

 app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = phones.filter(note => note.id !== id)
    console.log(notes)
    response.status(204).end()
  })
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log('Server running on port ${PORT}')
})