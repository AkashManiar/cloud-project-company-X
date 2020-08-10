import express from "express"
import bodyParser from "body-parser"
import router from "./routes"
// import { connectDB } from "./db"


let app = express()
let port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', router)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Connecting to database Uncomment this 
// connectDB
app.listen(port)
console.log("Server is running at: "+port)