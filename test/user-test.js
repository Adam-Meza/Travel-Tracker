import chai from 'chai';
const expect = chai.expect;
import Trip from '../src/clasess/Trip';
import User from '../src/clasess/User';
import { destinations } from './test-data/destination-test-data';
import { trips } from './test-data/trips-test-data';
import { travelers } from './test-data/user-test-data';

describe("User Class", () => {

  let makeTripArray = (data, userID) => {
    userID ? data = data.filter(trip => trip.userID === Number(userID)) : null ; 
    return data .map(trip => {
        let destination = destinations.find(dest => dest.id === trip.destinationID);
        return new Trip(trip, destination)
    });
  };

  let userId,
      tripsTest,
      user;

  beforeEach( () => {
    userId = 44
    tripsTest = makeTripArray(trips, userId)
    user = new User(travelers[0], tripsTest)

  });

  it("should hold all the information in properties", () => {
    expect(user.id).to.equal(44)
    expect(user.name).to.equal('Alice Smith')
    expect(user.travelerType).to.equal('adventurer')
    expect(user.trips).to.deep.equal( [
       {
        id: 2,
        userID: 44,
        destinationID: 2,
        date: '2022/10/04',
        duration: 18,
        status: 'approved',
        suggestedActivities: [],
        travelers: 5,
        destination: {
           "alt": "city with boats on the water during the day time",
           "destination": "Stockholm, Sweden",
           "estimatedFlightCostPerPerson": 780,
           "estimatedLodgingCostPerDay": 100,
           "id": 2,
           "image": "https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          },
        image: 'https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        totalPrice: 6270,
        endDate: '10/22/2022'
      }])
  });

  it("should be able to calculate the total spent on trips",  () => {
    expect(user.totalSpentOnTrips()).to.deep.equal(6270)
  });

  it('should return an error message if the trips data is invalid', () => {
    let invalidUser = new User({ id: 2, name: "Bob Johnson", travelerType: "foodie" })

    expect(invalidUser.totalSpentOnTrips()).to.equal("Trips Data is undefined")
   })

});