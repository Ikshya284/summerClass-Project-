const express = require("express");
const cors = require("cors");

const sequelize = require("./src/config/database");

require("./src/models/User");

const authRoutes = require("./src/routes/authRoutes");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);


sequelize.sync()
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log(err);
});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});