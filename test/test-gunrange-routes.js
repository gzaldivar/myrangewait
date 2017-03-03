process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../app');
var Gunrange = require('../models/gunrange');
var User = require('../models/user');
var Blog = require('../models/blog');

var user;

var should = chai.should();
chai.use(chaiHttp);

mongoose.Model.on('index', function(err) {
  if (err) logger.error(err);
});

describe('Gunranges', function() {

  Gunrange.collection.drop();

  beforeEach(function(done){
    var Range1 = new Gunrange({
      name: 'Athena',
      addressNumber: '3961',
      street: 'Hendrix',
      city: 'Irvine',
      state: 'CA',
      zip: '92612',
      phone: '949-632-6440',
      rangetype: 'Outdoor',
      loc: { type: 'Point', coordinates: [ parseFloat(-117.8231107), parseFloat(33.6694649) ] }
    });

    var Range2 = new Gunrange({
      name: 'The Killer',
      addressNumber: '4',
      street: 'Shit Zu',
      city: 'RSM',
      state: 'CA',
      zip: '92688',
      phone: '949-632-6440',
      rangetype: 'Indoor',
      loc: { type: 'Point', coordinates: [ parseFloat(-117.6022222), parseFloat(33.6408333) ] }
    });

    user = new User({
      email : "gzaldivar@icloud.com",
      password : "Apollo"
    })

    user.save(function(err, user) {
      Range1.user = user._id;
      Range1.save(function(err) {
        Range2.save(function(err) {
          done();
        })
      })
    });

  });

  afterEach(function(done){
    Gunrange.collection.drop();
    done();
  });

  it('should list ALL gunranges on /gunrange GET', function(done) {

    chai.request(server)
      .get('/gunrange')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('addressNumber');
        res.body[0].should.have.property('street');
        res.body[0].should.have.property('city');
        res.body[0].should.have.property('state');
        res.body[0].should.have.property('zip');
        res.body[0].should.have.property('phone');
        res.body[0].should.have.property('rangetype');
        res.body[0].name.should.equal('Athena');
        res.body[0].addressNumber.should.equal(3961);
        res.body[0].street.should.equal('Hendrix');
        res.body[0].city.should.equal('Irvine');
        res.body[0].state.should.equal('CA');
        res.body[0].zip.should.equal('92612');
        res.body[0].phone.should.equal('949-632-6440');
        res.body[0].rangetype.should.equal('Outdoor');
        res.body[1].name.should.equal('The Killer');
        done();
    });
  });

  it('should list a SINGLE gunrange on /gunrange/<id> GET', function(done) {

    var Range1 = new Gunrange({
      name: 'Athena',
      addressNumber: '3961',
      street: 'Hendrix',
      city: 'Irvine',
      state: 'CA',
      zip: '92612',
      phone: '949-632-6440',
      rangetype: 'Outdoor',
      loc: { type: 'Point', coordinates: [ -117.8231107, 33.6694649 ] }
    });

    Range1.save(function(err, data) {
      chai.request(server)
        .get('/gunrange/' + data.id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('addressNumber');
          res.body.should.have.property('street');
          res.body.should.have.property('city');
          res.body.should.have.property('state');
          res.body.should.have.property('zip');
          res.body.should.have.property('phone');
          res.body.should.have.property('rangetype');
          res.body.name.should.equal('Athena');
          res.body.addressNumber.should.equal(3961);
          res.body._id.should.equal(data.id);
          res.body.street.should.equal('Hendrix');
          done();
        });
    });
  });

  it('should add a SINGLE gunrange on /gunrange POST', function(done) {
    chai.request(server)
      .post('/gunrange')
      .send({
          'name': 'Apollo',
          'addressNumber': '4',
          'street': 'Edelweiss',
          'city': 'Rancho Santa Margarita',
          'state': 'CA',
          'zip': '92688',
          'phone': '949-632-6440',
          'rangetype': 'Indoor'
        })
      .end(function(err, res){
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('addressNumber');
        res.body.should.have.property('_id');
        res.body.name.should.equal('Apollo');
        res.body.addressNumber.should.equal(4);
        res.body.street.should.equal('Edelweiss');
        res.body.city.should.equal('Rancho Santa Margarita');
        res.body.state.should.equal('CA');
        res.body.zip.should.equal('92688');
        res.body.phone.should.equal('949-632-6440');
        res.body.rangetype.should.equal('Indoor');
        done();
      });
  });

  it('should fail to update a SINGLE gunrange on /gunrange/<id> PUT - missing address', function(done) {
    chai.request(server)
      .get('/gunrange')
      .end(function(err, res){
        chai.request(server)
          .put('/gunrange/' + res.body[0]._id)
          .send({'name': 'Zena'})
          .end(function(error, response){
            response.should.have.status(404);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('error');
            response.body.error.should.equal('Address could not be found');
            done();
      });
    });
  });

  it('should pdate a SINGLE gunrange on /gunrange/<id> PUT', function(done) {
    chai.request(server)
      .get('/gunrange')
      .end(function(err, res){
        chai.request(server)
          .put('/gunrange/' + res.body[0]._id)
          .send({
            'name': 'Zena',
            'addressNumber': res.body[0].addressNumber,
            'street': res.body[0].street,
            'city': res.body[0].city,
            'state': res.body[0].state,
            'zip': res.body[0].zip,
            'phone': res.body[0].phone,
            'rangetype': res.body[0].rangetype
          })
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('_id');
            response.body.should.have.property('name');
            response.body.should.have.property('addressNumber');
            response.body.should.have.property('street');
            response.body.should.have.property('city');
            response.body.should.have.property('state');
            response.body.should.have.property('zip');
            response.body.should.have.property('phone');
            response.body.should.have.property('rangetype');
            response.body.name.should.equal('Zena');
            done();
      });
    });
  });

  it('should delete a SINGLE gunrange on /gunrange/<id> DELETE', function(done) {
    chai.request(server)
      .get('/gunrange')
      .end(function(err, res){
        chai.request(server)
          .delete('/gunrange/'+res.body[0]._id)
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('_id');
            done();
      });
    });
  });

  it('should list ALL gunranges on /gunrange/search/getbyzip GET that are within 50 miles of zip code', function(done) {
    chai.request(server)
      .get('/gunrange/search/getbyzip?zip=92688&distance=50')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('addressNumber');
        res.body[0].should.have.property('street');
        res.body[0].should.have.property('city');
        res.body[0].should.have.property('state');
        res.body[0].should.have.property('zip');
        res.body[0].should.have.property('phone');
        res.body[0].should.have.property('rangetype');
        res.body[0].name.should.equal('Athena');
        res.body[0].addressNumber.should.equal(3961);
        res.body[0].street.should.equal('Hendrix');
        res.body[0].city.should.equal('Irvine');
        res.body[0].state.should.equal('CA');
        res.body[0].zip.should.equal('92612');
        res.body[0].phone.should.equal('949-632-6440');
        res.body[0].rangetype.should.equal('Outdoor');
        res.body[1].name.should.equal('The Killer');
        done();
    });
  });

  it('should add a SINGLE post on /gunrange/blog POST', function(done) {
    chai.request(server)
      .post('/gunrange/blog')
      .send({
        user : user._id,
        postedby: "Christian",
        waittime: 10,
        })
      .end(function(err, res){
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.should.have.property('postedby');
        res.body.should.have.property('_id');
        res.body.should.have.property('waittime');
        res.body.should.have.property('lastUpdate');
        res.body.postedby.should.equal("Christian");
        res.body.waittime.should.equal(10);
        done();
    });
  });

});
