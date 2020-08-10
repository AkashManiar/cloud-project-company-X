
const CustomerAccountController = {
    getHomePage: (req, res) => {
        res.render('homepage')
    }
    // getJobs: (req, res) => {
    //     Jobs.findAll({
    //         attributes: ['jobName', 'partId', 'qty']
    //     }).then(
    //         jobs => {
    //             res.json({success: true, jobs})
    //         }
    //     ).catch(err => {
    //         console.log("-------------------------------------------")
    //         console.log(err)
    //         console.log("-------------------------------------------")
    //         res.json({success: false, code: err.original.code, message: "Jobs table does not exists, please add data to 'Jobs' table first"})
    //     })
    // },

    // getJobIndex: (job_name, part_id) => {
    //     let isJobFound = false
    //     let index = -1
    //     for (let i=0; i < jobs446.length; i++) {
    //         let job = jobs446[i]
    //         if (job.jobName == job_name || job.partId == part_id) {
    //             isJobFound = true
    //             index = i
    //         }
    //     }
    //     return index
    // },

    // getQuantity: (req,res) => {
    //     let job_name = req.query.jobName
    //     let part_id = req.query.partId
        
    //     if (job_name && part_id) {
    //         const query = {'jobName': job_name, "partId": part_id}
            
    //         Jobs.findOne({
    //             where: query
    //         }).then(jobs => {
    //             if (jobs) {
    //                 res.json({success: true, jobs})
    //             }
    //         }).catch(err2 => {
    //             res.json({ success: false, code: err.original.code, message: "Error in finding record" })
    //         })
    //     } else {
    //         res.json({success: false, message: "Oops! some error with updating data"}) 
    //     }
    // },
    
    // addPart: (req, res) => {
    //     if (req.body != {} && !!req.body) {
    //         const query = {'jobName': req.body.job_name, "partId": req.body.part_id}

    //         Jobs.findAll({
    //             where: query,
    //         }).then(
    //             jobs => {
    //                 if (jobs.length == 0) {
    //                     query.qty = req.body.quantity 
    //                     Jobs.create(query)
    //                         .then(data => {
    //                             res.json({success: true, message: "Successfully added your job to database"})
    //                         }).catch(err1 => {
    //                             res.json({ success: false, code: err.original.code, message: "Error in adding data" })  
    //                         })
    //                 } else {
    //                     res.json({success: false, message: "Provided data already exist in database"})
    //                 }
    //             }
    //         ).catch(err => {
    //             res.json({ success: false, code: err.original.code, message: "Error in finding data" })
    //         })
    //     } else {
    //         res.json({success: false, message: "Oops! some error with adding data"})
    //     }
    // },

    // updatePart: (req, res) => {
    
    //     if (req.body != {} && !!req.body && req.body.job_name && req.body.part_id) {
    //         const query = {'jobName': req.body.job_name, "partId": req.body.part_id}
            
    //         Jobs.findOne({
    //             where: query
    //         }).then(job => {
    //             if (job) {
    //                 console.log('HERE!!');
    //                 query.qty = req.body.quantity
    //                 job.update(
    //                     { qty: req.body.quantity },
    //                     { where: query }
    //                 ).then(t =>
    //                     res.json({ success: true, message: "Successfully updated jobs record" })
    //                 ).catch(err => {
    //                     res.json({ success: false, code: err.original.code, message: "Error in updating record" })
    //                 })
    //             }
    //         }).catch(err2 => {
    //             res.json({ success: false, code: err.original.code, message: "Error in finding record" })
    //         })
    //     } else {
    //         res.json({success: false, message: "Oops! some error with updating data"}) 
    //     }
    // }
}

module.exports = CustomerAccountController