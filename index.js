require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('custom', (req) => {

  if(req.method === 'POST') {
    return `${JSON.stringify(req.body)}`
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] -:response-time ms :custom'))


let persons = [
  {
    'name': 'Jorma Petteri',
    'number': '040 120 321',
    'id': 1
  },
  {
    'name': 'Erkki',
    'number': '040 322 1212',
    'id': 2
  },
  {
    'name': 'Cheek',
    'number': '123123123',
    'id': 3
  }
]

app.get('/info', (req,res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length}</p>
    <p>${date}<p>
    `)
})
app.get('/api/persons', (req,res,next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (req,res,next) => {
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })


})
app.delete('/api/persons/:id', (req,res,next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(result)

      res.status(204).json(result).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (req,res,next) => {
  const person = {
    number: req.body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true },next)
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

// eslint-disable-next-line no-unused-vars
const generateID = () => {
/*     const maxId = persons.length < 0
    ? Math.max(...notStrictEqual.map(n => n.id))
    : 0 */
  const maxId = Math.floor(Math.random() * 100000000000000) + 1
  return maxId + 1
}

app.post('/api/persons', (req,res,next) => {

  const body = req.body
  console.log(body)


  const newPerson = new Person({
    name: body.name,
    number: body.number || ''

  })

  newPerson.save().then(savedPerson => {
    res.status(200).json(savedPerson)
  })
    .catch(error => {
      next(error)
    })
    /* persons = persons.concat(newPerson)
    res.json(newPerson) */

})



/* const unknownEndpoint = (error, request, response, next ) => {
    response.status(404).send({ error: 'unknown endpoint' })
    next(error)
  }

  app.use(unknownEndpoint) */

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if(error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)