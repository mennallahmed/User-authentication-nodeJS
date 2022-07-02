const mongoose = require("mongoose")

// create user schema
const userSchema = new mongoose.Schema({
  //schema type
  firstName: {type: String, required: true, minLength: 5, maxLength: 20},
  lastName: {type: String, required: true, minLength: 5, maxLength: 20},
  email: {type: String, unique: true, match: /.+@.+\..+/},
  password: { type: String },
  token: { type: String },
  //posts: [ {type: mongoose.Schema.Types.ObjectId, ref:"post"}]

})

// instance method
userSchema.methods.getFullName = function(){
  return `${this.firstName} ${this.lastName}` 
}

// static method / class method
//UserModel.getUserByFullName("Menna Ahmed",(err,user)=>{ })
userSchema.statics.getUsersByFullName = function(fullName, cb){
  const [firstName, lastName] = fullName.split(" ")
  this.find({firstName,lastName}, cb)

}

// create table(collection) "user" w ba3ml apply ll userSchema 
const UserModel = mongoose.model("user",userSchema)

module.exports = UserModel