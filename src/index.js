import connectDB from "./db/db.js";
import app from "./app.js";
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`Server listening on ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("Mongo connection error",error);    
})