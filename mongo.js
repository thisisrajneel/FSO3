const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide some password.');
    process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://rajneel:${password}@cluster0.i7ait.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(uri)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${person.name} ${person.number} to phonebook`);
        mongoose.connection.close()
    })
}

else if(process.argv.length == 3) {
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })

        mongoose.connection.close()
    })
}

else {
    console.log('Enter commmand line parameters in the following format: <Password> <Name> <Number> || <Password>');
    process.exit(1)
}