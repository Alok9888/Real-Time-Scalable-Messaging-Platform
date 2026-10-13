import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js'; 
import userRoutes from './routes/userRoutes.js';
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from 'cookie-parser';


dotenv.config({});
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})

