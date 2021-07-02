const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const passwordValidator = require('password-validator');

// const schema = new passwordValidator();

// schema.is().min(8)                                   
// .is().max(100)                               
// .has().uppercase()                             
// .has().lowercase()                              
// .has().digits(2)                              
// .has().not().spaces()                           
// .is().not().oneOf(['Passw0rd', 'Password123']);


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);