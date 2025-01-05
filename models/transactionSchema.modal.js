import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  status: { type: String, enum: ["success", "pending", "failed"] },
  type: { type: String, enum: ["debit", "credit"] },
  transactionDate: { type: Date },
  amount: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
