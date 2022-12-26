import mongoose from 'mongoose';
const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  members: {
    type: Array,
    required: true
  }
}); 
const Group = mongoose.model('Group', GroupSchema);
export default Group;