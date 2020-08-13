import express from 'express'
import CustomerAccControllers from '../controllers/customer-account.controller.js'
import TransactionControllers from '../controllers/transactions-controller.js'

const { Router } = express

const  {
    getHomePage,
    addCustomerGET,
    addCustomerPOST,
    getCustomers,
    deleteCustomer,
    editCustomer,
    editCustomerDetails
} = CustomerAccControllers

const {
    deleteTransaction,
    makeTransaction,
    getTransactions,
    getItems
} = TransactionControllers

const router = Router()

// HomePage
router.get('/', getHomePage)

// Customer account routes
router.get('/addCustomer', addCustomerGET)
router.get('/getCustomers', getCustomers)
router.post('/addCustomer', addCustomerPOST)
router.get('/deleteCustomer/:accountNo', deleteCustomer)
router.post('/editCustomer', editCustomer)
router.post('/editCustomer/:accountNo', editCustomerDetails)

// Transactions
router.get('/getTransactions', getTransactions)
router.post('/makeTransaction', makeTransaction)
router.get('/deleteTransaction/:transactionId', deleteTransaction)
router.get('/getItems', getItems)

export default router