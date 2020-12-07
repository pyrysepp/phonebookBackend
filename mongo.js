const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length<3) {
  console.log('give password as argument')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]
const collectionName = 'phonebook'
// eslint-disable-next-line no-undef
const newName = process.argv[3]
// eslint-disable-next-line no-undef
const newNumber = process.argv[4]

const url = `mongodb+srv://fullstack-pyry:${password}@cluster0.bfoth.mongodb.net/${collectionName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(newName) {
  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}