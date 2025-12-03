const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    user_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"User",
    },
    name: { type: String, required: true },
    email: { type: String, required: true,unique:[true,"Email address already taken"] },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
