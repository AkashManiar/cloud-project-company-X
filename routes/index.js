import { Router } from "express"
import bodyParser from "body-parser"
import {
    getHomePage
} from "../controllers/customer-account.controller"


const router = Router()

// pass jsonParser this as second param where u make request other than get
const jsonParser = bodyParser.json()

// HomePage
router.get('/', getHomePage)

module.exports = router