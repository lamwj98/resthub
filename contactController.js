// contactController.js

const { request } = require('express');
const e = require('express');

// Import contact model
Contact = require('./contactModel');
// Handle index actions
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: "Contacts retrieved successfully",
                data: contacts
            });
        }
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    if (req.body.name != null && req.body.email != null) {
        var contact = new Contact();
        contact.name = req.body.name;
        contact.gender = req.body.gender;
        contact.email = req.body.email;
        contact.phone = req.body.phone;

        contact.save(function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    message: 'New contact created!',
                    data: contact
                });
            }
        });
    } else {
        res.json({
            message: "Missing fields"
        });
    }
// save the contact and check for errors

};
// Handle view contact info
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
            res.json({
                message: "ID does not exist"
            });
        } else {
            res.json({
                message: 'Contact details loading..',
                data: contact
            });
        }
    });
};
// Handle update contact info
exports.update = function (req, res) {
Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
            res.send({
                message: "ID does not exist"
            });
        } else {
            contact.name = req.body.name ? req.body.name : contact.name;
            contact.gender = req.body.gender ? req.body.gender : contact.gender;
            contact.email = req.body.email ? req.body.email : contact.email;
            contact.phone = req.body.phone ? req.body.phone : contact.phone;

            // save the contact and check for errors
            contact.save(function (err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        message: 'Contact Info updated',
                        data: contact
                    });
                }
            });
        }
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err) {
            res.send({
                message: "Error faced while deleting!"
            });
        } else {
            res.json({
                status: "success",
                message: 'Contact deleted',
                data: contact
            });
        }
    });
};