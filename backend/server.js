require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const verifyRoute = require('./routes/verifyRoute');
const authRoute = require('./routes/authRoute');

const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("Loan Backend Running Successfully");
});

app.use('/api', verifyRoute);
app.use('/auth', authRoute);

app.listen(process.env.PORT, () => {
  console.log("Server started on port", process.env.PORT);
});
