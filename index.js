
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response, json } = require('express')
const { notStrictEqual } = require('assert')

const app = express()

app.use(express.json())
app.use(cors())
morgan.token('custom', (req,res) => {
    
    if(req.method === "POST") {
        return `${JSON.stringify(req.body)}`
    } else {
        return ``
    }
})
app.use(morgan(':method :url :status :res[content-length] -:response-time ms :custom'))


    let persons = [
      {
        "name": "Jorma Petteri",
        "number": "040 120 321",
        "id": 1
      },
      {
        "name": "Erkki",
        "number": "040 322 1212",
        "id": 2
      },
      {
        "name": "Cheek",
        "number": "123123123",
        "id": 3
      }
    ]
  
app.get('/info', (req,res) => {
    const date = new Date()
    res.send(`
    <p>Phonebook has info for ${persons.length}</p>
    <p>${date}<p>
    `)
})
app.get('/api/persons', (req,res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    
    const person = persons.find(p => p.id === id)
    if(person){
    
    response.json(person)
    } else {
    response.status(404).end()
    }
})
app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
   
    res.status(204).end()
})

const generateID = () => {
/*     const maxId = persons.length < 0
    ? Math.max(...notStrictEqual.map(n => n.id))
    : 0 */
    const maxId = Math.floor(Math.random() * 100000000000000) + 1  
    return maxId + 1
}

app.post('/api/persons', (req,res) => {
    
    const body = req.body
    
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }
    
    const newPerson = {
        name: body.name,
        number: body.number || '',
        id: generateID()
    }

    if(persons.some(p => p.name === newPerson.name)) {
        return res.status(400).json({
            error: 'name already exists in the phonebook'
        })
    }

    
    persons = persons.concat(newPerson)
    res.json(newPerson)

})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)