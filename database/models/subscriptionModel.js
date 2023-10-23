const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
