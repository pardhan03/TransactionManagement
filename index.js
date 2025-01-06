import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import Transaction from "./models/transactionSchema.modal.js";
import User from "./models/user.model.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/transactions/user/:userId", async (req, res) => {
  try {
    const { status, type, from, to } = req.query;
    console.log(status);

    const match = { userId: req.params.userId };
    if (status) match.status = status;
    if (type) match.type = type;
    if (from || to) {
      match.transactionDate = {};
      if (from) match.transactionDate.$gte = new Date(from);
      if (to) match.transactionDate.$lte = new Date(to);
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const { status, type, from, to, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const match = {};
    if (status) match.status = status;
    if (type) match.type = type;
    if (from || to) {
      match.transactionDate = {};
      if (from) match.transactionDate.$gte = new Date(from);
      if (to) match.transactionDate.$lte = new Date(to);
    }

    const transactions = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $sort: { transactionDate: -1 } },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
    ]);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/seed", async (req, res) => {
  try {
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({ name: `User${i + 1}`, phoneNumber: `123456789${i}` });
    }
    const createdUsers = await User.insertMany(users);

    const transactions = [];
    createdUsers.forEach((user) => {
      for (let i = 0; i < 5; i++) {
        transactions.push({
          status: ["success", "pending", "failed"][
            Math.floor(Math.random() * 3)
          ],
          type: ["debit", "credit"][Math.floor(Math.random() * 2)],
          transactionDate: new Date(Date.now() - Math.random() * 1000000000),
          amount: Math.floor(Math.random() * 10000),
          userId: user._id,
        });
      }
    });
    await Transaction.insertMany(transactions);

    res.json({ message: "Database seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
