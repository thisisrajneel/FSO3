const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const found = persons.find(person => person.id === id)
    if(found) {
        res.json(found)
    }
    else {
        res.status(404).end()
    }
})

const generateId = () => {
    let num = Math.random()*1000000
    num = Math.floor(num)
    return num
}

app.post('/api/persons', (req, res) => {
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
    else if( persons.find( p => p.name === req.body.name )) {
        return res.status(404).json({
            error:"Name must be unique"
        })
    }
    
    const person = {
        "id": generateId(),
        "name": req.body.name,
        "number": req.body.number
    }
    console.log(person);
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id  = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
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