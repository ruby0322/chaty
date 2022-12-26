import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  friends: {
    type: Array,
    required: false
  },
  groups: {
    type: Array,
    required: false
  }
}); 
const User = mongoose.model('User', UserSchema);
export default User;