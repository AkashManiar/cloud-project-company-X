import { CustomerAccount } from "../models/CustomerAccount.js"

const CustomerAccountController = {
    getHomePage: (req, res) => {
        res.render('homepage')
    },
    getCustomers: (req, res, message="", success=false) => {
        const isMessage = typeof message === 'string'
        CustomerAccount.findAll({}).then(
            customers => {
                res.render('customerList', { success, message: isMessage ? message : "", customers})
            }
        ).catch(err => {
            console.log('__Error_',err);
            res.render('customerList', { success, message: isMessage ? message : "Error occurred in fetching customer data."})
        })
    },
    addCustomerGET: (req, res, message, success=false) => {
        const isMessage = typeof message === 'string'
        res.render('addCustomer', { success, message: isMessage ? message : ""})
    },
    addCustomerPOST: (req, res) => {
        if (req.body != {} && !!req.body) {
            let balance = req.body.balance || 0
            if (balance && balance < 0) {
                balance = 0
            }
            const query = {
                'customer_name' : req.body.customer_name,
                'address' : req.body.address ? req.body.address : '',
                'phone_number' : req.body.phone_number,
                'email' : req.body.customer_email,
                'balance' : balance
            }
        CustomerAccount.create(query)
            .then(customer => {
                CustomerAccountController.addCustomerGET(req, res, 'Successfully added customer details and created acc, click on view customers to get customers..', true)
            }).catch(err => {
                console.log('__Error__', err);
                CustomerAccountController.addCustomerGET(req, res, 'Some error occurred while adding customers.', false)
            })
        } else {
            CustomerAccountController.addCustomerGET(req, res, 'Parameters are not as per requirement.', false)
        }
    },
    deleteCustomer: (req, res) => {
        const account_no = req.params.accountNo
        CustomerAccount.destroy({
            where:{
                account_no
            }
        })
        .then(() => {
            CustomerAccountController.getCustomers(req, res, 'Successfully deleted the customer from records.', true)
        }).catch(err => {
            console.log('__Delete Err__', err);
            CustomerAccountController.getCustomers(req, res, 'Some error occurred in deleting the customer.', false)
        })
    },
    editCustomer: (req, res, message="", success=false) => {
        const isMessage = typeof message === 'string'
        
        let balance = req.body.balance || 0
        if (balance && balance < 0) {
            balance = 0
        }
        const customer = {
            'account_no': req.body.account_no,
            'customer_name' : req.body.customer_name,
            'address' : req.body.address ? req.body.address : '',
            'phone_number' : req.body.phone_number,
            'email' : req.body.customer_email,
            'balance' : balance
        }
        res.render('editCustomer', { success, message: isMessage ? message : "", customer})
    },
    editCustomerDetails: (req, res) => {
        const account_no = req.params.accountNo
        let balance = req.body.balance || 0
        if (balance && balance < 0) {
            balance = 0
        }
        const query = {
            'customer_name' : req.body.customer_name,
            'address' : req.body.address ? req.body.address : '',
            'phone_number' : req.body.phone_number,
            'email' : req.body.customer_email,
            'balance' : balance
        }
        CustomerAccount.update(
            query,
            { where: { account_no } }
        ).then(() => {
            CustomerAccountController.getCustomers(req, res, 'Successfully edited customer details.', true)
        }).error(err => {
            console.log('__Err__', err);
            CustomerAccountController.editCustomer(req, res, 'Failed to update customer details please try again.', false)
        })
    }
}

export default CustomerAccountController