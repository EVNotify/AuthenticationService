const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const server = require('../index');
const should = chai.should();
const errors = require('../errors.json');

const authModel = require('../models/Auth');

chai.use(chaiHttp);

before((done) => {
    server.on('server_ready', async () => done());
});

let AKey;
let Token;

describe('Authentication', () => {
    describe('GET', () => {
        it('Requesting non-existing route should fail', (done) => {
            chai.request(server)
                .get('/')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(404);
                    response.body.should.have.property('error').eql(errors.UNKNOWN_ROUTE);
                    done();
                });
        });
        it('Requesting AKey without authorization header should be rejected', (done) => {
            chai.request(server)
            .get('/authentication/akey')
            .end((err, response) => {
                should.not.exist(err);
                should.exist(response);
                response.should.have.status(400);
                response.body.should.have.property('error').eql(errors.MISSING_AUTHORIZATION);
                done();
            });
        });
        it('Requesting AKey with non-existing authorization header should be rejected', (done) => {
            chai.request(server)
            .get('/authentication/akey')
            .set('Authorization', 'Bearer Test')
            .end((err, response) => {
                should.not.exist(err);
                should.exist(response);
                response.should.have.status(404);
                response.body.should.have.property('error').eql(errors.UNKNOWN_AUTHORIZATION);
                done();
            });
        });
        it('Requesting AKey should return random AKey', (done) => {
            chai.request(server)
                .get('/authentication/akey')
                .set('Authorization', 'Bearer TestKey')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(200);
                    response.body.should.have.property('akey').to.be.a('string').with.lengthOf(6);
                    AKey = response.body.akey;
                    done();
                });
        });
        it('Requesting AKey again should return a different AKey', (done) => {
            chai.request(server)
                .get('/authentication/akey')
                .set('Authorization', 'Bearer TestKey')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(200);
                    response.body.should.have.property('akey').to.be.a('string').with.lengthOf(6);
                    response.body.akey.should.not.eql(AKey);
                    done();
                });
        });
    });
    describe('POST', () => {
        it('Requesting non-existing route should fail', (done) => {
            chai.request(server)
                .post('/')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(404);
                    response.body.should.have.property('error').eql(errors.UNKNOWN_ROUTE);
                    done();
                });
        });
        it('Register without authorization header should be rejected', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}`)
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.MISSING_AUTHORIZATION);
                    done();
                });
        });
        it('Register with no password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}`)
                .set('Authorization', 'Bearer TestKey')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.INVALID_PASSWORD);
                    done();
                });
        });
        it('Register with too short password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: "123"
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.INVALID_PASSWORD);
                    done();
                });
        });
        it('Register with valid password should return generated token', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: "123abc"
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(200);
                    response.body.should.have.property('token').with.lengthOf(20);
                    done();
                });
        });
        it('Register same AKey with valid password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: "123abc"
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(409);
                    response.body.should.have.property('error').eql(errors.AKEY_ALREADY_REGISTERED);
                    done();
                });
        });
        it('Login without authorization header should be rejected', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/login`)
                .send({
                    password: "123abc"
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.MISSING_AUTHORIZATION);
                    done();
                });
        });
        it('Login with no password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/login`)
                .set('Authorization', 'Bearer TestKey')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.INVALID_PASSWORD);
                    done();
                });
        });
        it('Login with too short password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/login`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: 'short'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.INVALID_PASSWORD);
                    done();
                });
        });
        it('Login with non-existing AKey should fail', (done) => {
            const randomAKey = crypto.randomBytes(3).toString('hex');

            chai.request(server)
                .post(`/authentication/${randomAKey}/login`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: '123abc'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(404);
                    response.body.should.have.property('error').eql(errors.AKEY_NOT_REGISTERED);
                    done();
                });
        });
        it('Login with existing AKey but wrong password should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/login`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: '123abcd'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(401);
                    response.body.should.have.property('error').eql(errors.UNAUTHORIZED);
                    done();
                });
        });
        it('Login with correct credentials should return token', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/login`)
                .set('Authorization', 'Bearer TestKey')
                .send({
                    password: '123abc'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(200);
                    response.body.should.have.property('token').with.lengthOf(20);
                    Token = response.body.token;
                    done();
                });
        });
        it('Verifying without authorization header should be rejected', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/verify`)
                .send({
                    password: '123abc'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.MISSING_AUTHORIZATION);
                    token = response.body.token;
                    done();
                });
        });
        it('Verifying token for non-existing AKey should fail', (done) => {
            const randomAKey = crypto.randomBytes(3).toString('hex');

            chai.request(server)
                .post(`/authentication/${randomAKey}/verify`)
                .set('Authorization', 'Bearer TestKey')
                .set('authentication', crypto.randomBytes(10).toString('hex'))
                .send({
                    password: '123abc'
                })
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(404);
                    response.body.should.have.property('error').eql(errors.AKEY_NOT_REGISTERED);
                    done();
                });
        });
        it('Verifying token with no token but existing AKey should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/verify`)
                .set('Authorization', 'Bearer TestKey')
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(400);
                    response.body.should.have.property('error').eql(errors.MISSING_AUTHENTICATION);
                    done();
                });
        });
        it('Verifying token with wrong token but correct AKey should fail', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/verify`)
                .set('Authorization', 'Bearer TestKey')
                .set('Authentication', crypto.randomBytes(10).toString('hex'))
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(401);
                    response.body.should.have.property('error').eql(errors.INVALID_TOKEN);
                    done();
                });
        });
        it('Verifying token wit correct token and AKey should succeed', (done) => {
            chai.request(server)
                .post(`/authentication/${AKey}/verify`)
                .set('Authorization', 'Bearer TestKey')
                .set('Authentication', Token)
                .end((err, response) => {
                    should.not.exist(err);
                    should.exist(response);
                    response.should.have.status(200);
                    response.body.should.have.property('verified').to.be.true;
                    done();
                });
        });
    });
});