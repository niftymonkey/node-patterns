var superagent = require("superagent"),
    expect = require("expect.js");

describe("express rest api tests", function() {
    var baseURL = "http://localhost:3000/collections/people",
        id;

    var log = function(msg) {
//        console.log(msg);
    };

    describe("POST", function() {
        it("creates a new object", function(done) {
            superagent.post(baseURL)
                // send an object
                .send({
                    name: "Mark",
                    email: "mark@emailaddress.com"
                })
                .end(function(err, res) {
                    log(res.body);

                    // should be no errors
                    expect(err).to.eql(null);
                    // there should be one body object in the array
                    expect(res.body.length).to.eql(1);
                    // the body will have a specific length
                    expect(res.body[0]._id.length).to.eql(24);
                    // set the id to what was in the res for use in the tests to follow
                    id = res.body[0]._id;

                    done();
                });
        });
    });

    describe("GET", function() {
        it("retrieves an object", function(done) {
            superagent.get(baseURL + id)
                .end(function (err, res) {
                    log(res.body);
                    expect(err).to.eql(null);
                    expect(typeof res.body).to.eql("object");
                    expect(res.body._id.length).to.eql(24);
                    expect(res.body._id).to.eql(id);
                    done();
                });
        });

        it("retrieves a collection of objects", function(done) {
            superagent.get(baseURL)
                .end(function (err, res) {
                    log(res.body);
                    expect(err).to.eql(null);
                    expect(res.body.length).to.be.above(0);
                    expect(res.body.map(function (item) {
                        return item._id;
                    }).to.contain(id));
                    done();
                });
        });
    });

    describe("PUT", function() {
        it("updates an object", function(done) {
            superagent.put(baseURL)
                .send({
                    name: "Bob",
                    email: "bob@emailaddress.com"
                })
                .end(function (err, res) {
                    log(res.body);
                    expect(err).to.eql(null);
                    expect(res.body.length).to.eql(1);
                    expect(res.body[0]._id.length).to.eql(24);
                    id = res.body[0]._id;
                    done();
                });
        });
        it("checks for the newly updated object", function(done) {
            superagent.get(baseURL + id)
                .end(function (err, res) {
                    log(res.body);
                    expect(err).to.eql(null);
                    expect(typeof res.body).to.eql("object");
                    expect(res.body._id.length).to.eql(24);
                    expect(res.body._id).to.eql(id);
                    expect(res.body.name).to.eql("Bob");
                    done();
                });
        });
    });

    describe("DELETE", function() {
        it("deletes an object", function(done) {
            superagent.del(baseURL + id)
                .end(function (err, res) {
                    log(res.body);
                    expect(err).to.eql(null);
                    expect(typeof res.body).to.eql("object");
                    expect(res.body.msg).to.eql("success");
                    done();
                });
        });
    });

});
