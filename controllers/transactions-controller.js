import axios from 'axios'
import { db } from "../db/index.js"
import { Transactions } from '../models/Transactions.js'
import { CustomerAccount } from "../models/CustomerAccount.js"

const TransactionsController = {
    // This is just Dummy Testing API to check Y's api response
    getItems: (req, res) => {
        axios.post(
            'https://csci5409-companyz.azurewebsites.net/updateCompanyY',
            {
                order_id: 2005,
                item_id: 17,
                user_id: 9,
                status: "success",
                qnt: 5,
                amount: 100
            },
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }}
            ).then(itemRes => {
            console.log('__ITEMRES.data__', itemRes);
        if (itemRes.statusText === 'OK' && JSON.stringify(itemRes.data) !== '{}')  {
            console.log('----HERE____');
            console.log("__Success__1", itemRes.data.success === true);
            console.log("__Success__2", itemRes.data.success === 'true');
            res.send({
                success: true
            })
        } else {
            res.send({
            success: false,
            isError: false,
            message: 'Some problem in getting OK response.'
            })
        }
        }).catch(err => {
            console.log('__Error in fetching all items of supplier__', err);
            res.send({
                success: false,
                isError: true
            })
        })
    },
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
            if (
                body.account_no &&
                body.vendor_name && 
                body.amount && 
                body.orderId &&
                body.itemId &&
                body.userId &&
                body.quanity
            ) {
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
                        // Here it creates a new transaction, which would be only committed for success response, rollbacked otherwise

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
                                        // Else bank gives green signal from their said and waits for response from Y, the supplier
                                        axios.post(
                                            'https://csci5409-companyz.azurewebsites.net/updateCompanyY',
                                            {
                                                order_id: body.orderId,
                                                item_id: body.itemId,
                                                user_id: body.userId,
                                                status: "success",
                                                qnt: body.quanity,
                                                amount: body.amount
                                            },
                                            {headers: {
                                                'Content-Type': 'application/json',
                                                'Access-Control-Allow-Origin': '*',
                                                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                                                'Access-Control-Allow-Headers': '*'
                                            }}
                                            ).then(itemRes => {
                                                console.log({ 'OrderId': body.orderId, 'itemId': body.itemId, 'userId': body.userId, 'quantity': body.quanity})
                                                console.log('___Response from Y__', itemRes.data);
                                            if (itemRes.statusText === 'OK' && JSON.stringify(itemRes.data) !== '{}')  {
                                                if (itemRes.data.success === 'true') {
                                                    // Getting success response from Y, hence updating user account

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
                                                        console.log('__Error in updating account details__', err3);
                                                            res.send({
                                                                success: false,
                                                                isError: true,
                                                                message: 'Some error occurred in updating account details.'
                                                            })
                                                        })
                                                } else {
                                                    console.log('Getting false response from Y hence rolling back.')
                                                    t.rollback()
                                                    res.send({
                                                        success: false,
                                                        isError: true,
                                                        error: itemRes.data.errorMessage,
                                                        message: 'Received false from Y through Z.'
                                                    })
                                                }
                                            } else {
                                                t.rollback()
                                                res.send({
                                                    success: false,
                                                    isError: false,
                                                    message: 'Some problem in getting OK response.'
                                                })
                                            }
                                        }).catch(err => {
                                            console.log('__Error in contacting supplier through Y__', err);
                                            t.rollback()
                                            res.send({
                                                success: false,
                                                isError: true
                                            })
                                        })
                                    }
                                    }).catch(err1 => {
                                        console.log('__Error in creating transaction__', err1);
                                        t.rollback();
                                        res.send({
                                            success: false,
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
                        success: false,
                        isError: true,
                        err: err2,
                        message: 'Error in finding account.'
                    })
                })
            } else {
                res.send({
                    success: false,
                    isError: false,
                    message: "Request body has got insufficient parameters, please check what you are passing, there should be 7 request parameters."
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