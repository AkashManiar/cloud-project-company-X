import express from "express"
import bodyParser from "body-parser"
import router from "./routes/index.js"
import { connectDB } from "./db/index.js"


let app = express()
let port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/', router)

// Connecting to database Uncomment this 
connectDB
app.listen(port)
console.log("Server is running at: "+port)