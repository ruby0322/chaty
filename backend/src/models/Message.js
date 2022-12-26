import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});
const Message = mongoose.model('Message', MessageSchema);
export default Message;