// process.env.NODE_ENV = "test";
import GeoLocation from '../app/models/Location.model';
import mongoose from 'mongoose';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

let expect = chai.expect;

chai.use(chaiHttp);
// //Our parent block
 describe('Locations', () => {
//   beforeEach((done) => { //Before each test we empty the database
//       GeoLocation.remove({}, (err) => { 
//          done();           
//       });        
//   });

  /*
   *   Test the GET route
   */
  describe('GET /location', () => {
    it('it should GET all the location', (done) => {
      chai.request(server)
        .get('/location')
        .then(res => {
          expect(res).to.have.status(200);
        })
        .catch(err => {
          throw err;
        });
      // res.body.should.be.a('array');
      // res.body.length.should.be.eql(0);
      done();
    });
  });

  /*
  *   Test the POST route
  */
  describe('POST /location', () => {
    it('it should POST a location ', (done) => {
      let location = {
        name: "Location test",
        year: "Location test"
      }
      chai.request(server)
        .post('/location')
        .send(location)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.have.ownProperty('name');
          expect(res.body.data).to.have.ownProperty('year');
          // expect(res.body).to.be.an('object');
        })
        .catch(err => {
          expect(err).to.have.status(400);
        });
      done();
    });

    it('it should not POST a Location without name or year', (done) => {
      let location = {
        name: "location test"
      }
      chai.request(server)
        .post('/location')
        .send(location)
        .then(res => {
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        })
        .catch(err => {
          expect(err).to.have.status(400);
        });
      done();
    });
    // res.status.should.equal(200);
    // // res.body.should.be.a('object');
    // // res.body.should.have.property('message').eql('Book successfully added!');
    // res.body.Note.should.equal('title');
    // res.body.Note.should.equal('content');
  });

  /*
  *   Test the GET/location/:locationId route
  */
  describe('GET /location/:locationId', () => {
    it('it should GET a location by the given id', (done) => {
      let location = new GeoLocation({
        name: "location test",
        year: "location test"
      });
      location.save((res, location) => {
        chai.request(server)
          .get('/location/' + location._id)
          .send(location)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
          })
          .catch(err => {
            throw err;
          });
        // res.body.should.be.a('array');
        // res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  /*
  *   Test the PUT/location/:locationId route
  */
 describe('PUT /location/:locationId', () => {
  it('it should UPDATE a location by the given id', (done) => {
    let location = new GeoLocation({
      name: "location test",
      year: "location test"
    });
    location.save((res, location) => {
      chai.request(server)
        .put('/location/' + location._id)
        .send({
          name: "location test updated",
          year: "location test updated"
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.message).equal('Location updated');
          // expect(res.body).to.be.an('array');
        })
        .catch(err => {
          throw err;
        });
      // res.body.should.be.a('array');
      // res.body.length.should.be.eql(0);
      done();
    });
  });
});

  /*
  *   Test the DELETE/location/:locationId route
  */
 describe('DELETE /location/:locationId', () => {
  it('it should DELETE a location by the given id', (done) => {
    let location = new GeoLocation({
      name: "location test",
      year: "location test"
    });
    location.save((res, location) => {
      chai.request(server)
        .delete('/location/' + location._id)
        .send({
          name: "location test delete",
          year: "location test delete"
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.message).equal('Location deleted successfully');
          // expect(res).to.be.json;
          // expect(res.body).to.be.an('array');
        })
        .catch(err => {
          throw err;
        });
      // res.body.should.be.a('array');
      // res.body.length.should.be.eql(0);
      done();
    });
  });
});

});