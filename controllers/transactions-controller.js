import { db } from "../db/index.js"
import { Transactions } from '../models/Transactions.js'
import { CustomerAccount } from "../models/CustomerAccount.js"

const TransactionsController = {
    getTransactions: (req, res) => {
        Transactions.findAll({}).then(
            transactions => {
                res.render('transactionList', { success: true, message: 'Successfully fetched transactions.', transactions})
            }
        ).catch(err => {
            console.log('__Transasction error__', err);
            res.render('transactionList', { success: false, message: 'Some error occurred in fetching transactions.'})
        })
    },
    deleteTransaction: (req, res) => {
        const transaction_id = req.params.transactionId
        if (!transaction_id) {
            res.send({
                success: false,
                isError: false,
                message: 'Please provide required parameter "transactionId".'
            })
        }
        Transactions.destroy({ 
            where: {
                transaction_id
            } 
        }).then(
            () => {
                TransactionsController.getTransactions(req, res)
            }
        ).catch(err => {
            console.log('___DELETE ERR__', err);
        })
    },
    makeTransaction: (req, res) => {
        if (req.body != {} && !!req.body) {
            const body = req.body
            if (body.account_no && body.vendor_name && body.amount) {
                const transaction = {
                    account_no: body.account_no,
                    vendor_name: body.vendor_name,
                    amount: body.amount
                }
                CustomerAccount.findOne({
                    where: {
                        account_no: body.account_no
                    }
                })
                .then(account => {
                    if (account && account !== {}) {
                            db.transaction().then(t => {
                                Transactions.create(
                                    transaction, 
                                    { transaction: t }
                                ).then(() => {
                                    const newBalance = account.balance - body.amount 
                                    if (newBalance < 0) {
                                        // Balance is less than 0 hence transaction gets rolled back
                                        t.rollback()
                                        res.send({
                                            success: false,
                                            isError: false,
                                            message: 'Account balance cannot go below 0. Please check transaction amount.'
                                        })
                                    } else {
                                        const updatedAccObj = {
                                            ...account,
                                            balance: newBalance
                                        }
                                        CustomerAccount.update(updatedAccObj, {
                                            where: {
                                                account_no: body.account_no
                                            } 
                                        }).then(() => {
                                            t.commit();
                                            res.send({
                                                success: true,
                                                isError: false,
                                                message: 'Successfully made a new transaction.'
                                            })
                                        }).catch(err3 => {
                                            t.rollback();
                                            console.log('__ERR3__', err3);
                                                res.send({
                                                    success: false,
                                                    isError: true,
                                                    message: 'Some error occurred in updating account details.'
                                                })
                                            })
                                        }
                                    }).catch(err1 => {
                                        t.rollback();
                                        console.log('__ERR1__', err1);
                                        res.send({
                                            success: true,
                                            isError: true,
                                            err: err1,
                                            message: 'Error in creating transaction.'
                                        })
                                    })
                            })
                    } else {
                        res.send({
                            success: false,
                            isError: false,
                            message: 'No account exist with provided account No.'
                        })
                    }
                }).catch(err2 => {
                    res.send({
                        success: true,
                        isError: true,
                        err: err2,
                        message: 'Error in finding account.'
                    })
                })
            } else {
                res.send({
                    success: false,
                    isError: false,
                    message: "Invalid request's body, please check That you are providing account_no, vendor_name and amount."
                })
            }
        } else {
            res.send({
                success: false,
                isError: false,
                message: "Invalid request's body"
            })
        }
    }
}

export default TransactionsController