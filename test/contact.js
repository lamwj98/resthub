process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Contact = require('../models/contactModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
describe('Contacts', () => {
    beforeEach((done) => { //Before each test we empty the database
        Contact.remove({}, (err) => {
           done();
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET contacts', () => {
      it('it should GET all the contacts', (done) => {
        chai.request(server)
            .get('/api/contacts')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST contact', () => {
        it('it should not POST a contact without name field', (done) => {
            let contact = {
                email: "tester@gmail.com"
            }
        chai.request(server)
            .post('/api/contacts')
            .send(contact)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('error');
                    res.body.should.have.property('message').eql('Missing field(s)');
                done();
            });
        });

        it('it should POST a contact ', (done) => {
            let contact = {
                name: "Allen Tan",
                email: "allen@gmail.com",
                gender: "male",
                phone: "91234567"
            }
        chai.request(server)
            .post('/api/contacts')
            .send(contact)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('New contact created!');
                    res.body.contact.should.have.property('name');
                    res.body.contact.should.have.property('email');
                    res.body.contact.should.have.property('gender');
                    res.body.contact.should.have.property('phone');
                done();
            });
        });
    });

    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id contact', () => {
        it('it should GET a contact by the given id', (done) => {
            let contact = new Contact({
                name: "Allen Tan",
                email: "allen@gmail.com",
                gender: "male",
                phone: "91234567"
            });
            contact.save((err, contact) => {
                chai.request(server)
            .get('/api/contacts/' + contact.id)
            .send(contact)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact retrieved successfully');
                    res.body.contact.should.have.property('name').eq('Allen Tan');
                    res.body.contact.should.have.property('email').eq('allen@gmail.com');
                    res.body.contact.should.have.property('gender').eq('male');
                    res.body.contact.should.have.property('phone').eq('91234567');
                    res.body.contact.should.have.property('_id').eq(contact.id);
                done();
            });
            });

        });
    });

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id contact', () => {
        it('it should UPDATE a contact given the id', (done) => {
            let contact = new Contact({
                name: "Allen Tan",
                email: "allen@gmail.com",
                gender: "male",
                phone: "91234567"
            });
            contact.save((err, contact) => {
                chai.request(server)
                    .put('/api/contacts/' + contact.id)
                    .send({
                        phone: "92445123"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Contact Info updated');
                        res.body.contact.should.have.property('phone').eql("92445123");
                        res.body.contact.should.have.property('name').eql("Allen Tan");
                        res.body.contact.should.have.property('email').eql("allen@gmail.com");
                        res.body.contact.should.have.property('gender').eql("male");
                        done();
                    });
            });
        });
    });
});
