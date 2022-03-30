require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const req = require('express/lib/request')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformated entry' })
    }
    else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Name must be at least 3 characters long.' })
    }

    next(error)
}

app.use(errorHandler)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req,res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    if(!req.body.name) {
        return res.status(404).json({
            error: "Name missing."
        })
    }
    else if(!req.body.number) {
        return res.status(404).json({
            error: "Number missing."
        })
    }
    else {
        const person = new Person({
            name: req.body.name,
            number: req.body.number
        })

        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
    }
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
            .then(deletedPerson => {
                res.json(deletedPerson)
            })
            .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators:true })
            .then(updatedPerson => {
                res.json(updatedPerson)
            })
            .catch(error => next(error))
})

// INCOMPLETE
// see how to get request header Date
app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people`)
    const text = res.header()._header
    const time = JSON.stringify(text.split('\n')[3])
    const newtime = time.substring(7, time.length-3)
    console.log(newtime);
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('app running on 3001');
})