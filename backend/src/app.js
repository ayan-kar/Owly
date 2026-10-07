import express from "express";
import { createServer } from "node:http"
import dotenv from "dotenv";
dotenv.config();

import dns from "dns"
dns.setServers(["1.1.1.1", "8.8.8.8"])

import mongoose from "mongoose";

import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";

import userRoutes from "./routes/userRoutes.js"


const app = express(); // *Express is not a server. 
//* app is just a request handler function. It says: “When an HTTP request comes in, here is how to route it.”

const server = createServer(app); // attaching app handler to http server

const io = connectToSocket(server)


app.use(cors());
app.use(express.json({ limit: "40kb" }))
app.use(express.urlencoded({ limit: "40kb", extended: true }))

app.get("/home", (req, res) => {
    return res.json({ "hello": "Ayan" })
})

app.use("/users", userRoutes);

app.use((req, res) => {
    res.redirect("/home");
});


const start = async () => {
    try {
        const connectionDB = await mongoose.connect(process.env.MONGO_URI);
        console.log(" Connected to MongoDB Atlas");
        console.log(`Host: ${connectionDB.connection.host}`);
        console.log(`Database: ${connectionDB.connection.name}`);

        server.listen(process.env.PORT, () => {
            console.log(` Server is working on ${process.env.PORT}`);
        });
    } catch (err) {
        console.error(" DB connection error:", err.message);
    }
};
start();
