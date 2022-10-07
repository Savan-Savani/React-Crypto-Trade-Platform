const express = require('express')
const bodyParser = require("body-parser")
const helmet = require("helmet")
const dotenv = require('dotenv')
let mongoose = require('mongoose')
let dbConfig = require("./config/db.config")
const authenticationRoutes = require("./routes/authenticationRoutes")
const userRoutes = require("./routes/userRoutes")
const complimentRoutes = require("./routes/complimentRoutes")
const walletRoutes = require("./routes/walletRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const cryptoRoutes = require("./routes/cryptoRoutes")
const cors = require("cors");

dotenv.config();

mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(helmet());
app.use(bodyParser.json());

app.use(express.static('public'))

app.use('/auth', authenticationRoutes)
app.use('/user', userRoutes)
app.use('/social', complimentRoutes)
app.use('/wallet', walletRoutes)
app.use('/transaction', transactionRoutes)
app.use("/crypto", cryptoRoutes)


app.get('/', (req, res) => {
  res.send('Backend is working properly');
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
