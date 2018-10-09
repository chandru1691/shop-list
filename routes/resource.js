var express = require('express');
var router = express.Router();

// model 
var Resource = require('../models/resource');

// resource routes and api
router.route('/resource')

    // save records to collection
    /*
    body
    -name
    -shopName
    -status
    */
    .post((req, res) => {

        var resource = new Resource();
        resource = Object.assign(resource, req.body);

        resource.save().then(() => {
            res.json({ message: 'Resource created!' });
        }).catch(() => {
            console.error((new Date).toUTCString() + ' Resource create:', err.message);
            res.status(500).json({ message: 'Something went wrong!' });
        })

    })

    // get list of records from collection
    /*
    query
    -query
    -perPage
    -page
    */
    .get((req, res) => {

        var paginate = {
            perPage: parseInt(req.query.perPage) || 10,
            page: parseInt(req.query.page) || 1
        }

        var queryCond = (req.query.search) ? { $text: { $search: req.query.search } } : {};

        Resource.count(queryCond).then((c) => {
            Resource.find(queryCond, {}, { skip: (paginate.perPage * paginate.page) - paginate.perPage, limit: paginate.perPage }).then((data) => {
                res.json({ items: data, pagination: { total: c, perPage: paginate.perPage, page: paginate.page }, message: 'Resource found!' });
            })
        }).catch((err) => {
            console.error((new Date).toUTCString() + ' Resource fetch:', err.message);
            res.status(500).json({ message: 'Something went wrong!' });
        })


    });

module.exports = router;