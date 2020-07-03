const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Username: { 
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max:[32, 'Too long, max is 32 characters'],
        required: true},
    Email: {
        type: String, 
        min: [4, 'Too short, min is 4 characters'],
        max:[32, 'Too long, max is 32 characters'],
        unique:true,
        lowercase: true,
        required: 'Email is require',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    Password: { 
        type: String, 
        required: 'Password is require',
        min: [4, 'Too short, min is 4 characters'], 
        max:[32, 'Too long, max is 32 characters']
    },
    Date: {
        type: Date,
        default: Date.now
    }
    
    
});





module.exports = mongoose.model('Users', userSchema)