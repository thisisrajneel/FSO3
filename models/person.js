const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
console.log('connecting to ', uri);

mongoose.connect(uri)
        .then(result => {
            console.log('connected to database');
        })
        .catch(error=> {
            console.log('error connecting to database: ', error.message);
        })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (num) => {
                if(!num.includes('-')) {
                    return (num.length > 7)
                }
                else {
                    const [a,b] = num.split('-')
                    return (a.length <= 3 && a.length >= 2 && parseInt(b))
                }
            }
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, retrievedObject) => {
        retrievedObject.id = retrievedObject._id.toString(),
        delete retrievedObject._id,
        delete retrievedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)