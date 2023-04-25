import chai from 'chai';
const expect = chai.expect;
import Trip from '../src/clasess/Trip';
import Agent from '../src/clasess/Agent';
import { destinations } from './test-data/destination-test-data';
import { trips } from './test-data/trips-test-data';
import { travelers } from './test-data/user-test-data';

describe("Agent Class", () => {
  let findDestination = (tripDestId) => destinations.find(dest => dest.id === tripDestId)
  let agent,
      agent2,
      testTrips,
      invalidAgent,
      smallerTripsArray

  beforeEach(() => {
    testTrips = trips.map(trip => new Trip(trip, findDestination(trip.destinationID)))
    smallerTripsArray = [trips[0], trips[2]].map(trip => new Trip(trip, findDestination(trip.destinationID)))
    
    agent = new Agent(travelers, testTrips, destinations)
    invalidAgent = new Agent(null, null, null)
    agent2 = new Agent(travelers, smallerTripsArray, destinations)
  });

  it("should hold the data in properties", () => {
    expect(agent.usersData).to.deep.equal(travelers)
    expect(agent.tripsData).to.deep.equal(testTrips)
    expect(agent.destinationsData).to.deep.equal(destinations)
  });

  it("should be able to calculate the total profit by default", () => {
    expect(agent.getTotalProfit()).to.equal(9172)
  });

  it("should be able to get the profit of any given array of Trips", () => {
    expect(agent.getTotalProfit(testTrips.slice(4))).to.equal(7602)
  });

  it("should return an error if trips argument is invalid", () => {
    expect(invalidAgent.getTotalProfit()).to.equal("Check Trips Arguement")
  })

  it("should default to getting the average profit of all trips", () => {
    expect(agent.getAverageProfit()).to.equal(416)
  });

  it("should be able to get the average profits of a given array of trips", () => {
    expect(agent.getAverageProfit(testTrips.slice(4))).to.equal(422)
  });

  it("should be able to get the total profits for a given year", () => {
    expect(agent.getTotalForYear(2022)).to.equal(8330)
  });

  it("should return an error if given year is invalid", () => {
    expect(invalidAgent.getTotalForYear()).to.equal("Check Year Arguement")
  });

  it("should be able to get the average total profit for each user", () => {
    expect(agent.getTotalUserAverage()).to.equal(45)
  });

  it("should be able to arrange users by Id", () => {
    expect(agent2.arrangeTripsByUserId()).to.deep.equal({
      '3': [
        {
          id: 3,
          userID: 3,
          destinationID: 2,
          date: '2022/05/22',
          duration: 17,
          status: 'approved',
          suggestedActivities: [],
          travelers: 4,
          destination: {
               "alt": "city with boats on the water during the day time",
               "destination": "Stockholm, Sweden",
               "estimatedFlightCostPerPerson": 780,
               "estimatedLodgingCostPerDay": 100,
               "id": 2,
               "image": "https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
             },
          image: 'https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
          totalPrice: 5302,
          endDate: '06/08/2022'
        }
      ],
      '4': [
        {
          id: 1,
          userID: 4,
          destinationID: 12,
          date: '2022/09/16',
          duration: 8,
          status: 'approved',
          suggestedActivities: [],
          travelers: 1,
          destination: {
            "alt": "overview of city with buildings, water and trees",
            "destination": "Wellington, New Zealand",
            "estimatedFlightCostPerPerson": 1200,
            "estimatedLodgingCostPerDay": 150,
            "id": 12,
            "image": "https://images.unsplash.com/photo-1442483221814-59f7d8b22739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
          },
          image: 'https://images.unsplash.com/photo-1442483221814-59f7d8b22739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
          totalPrice: 2640,
          endDate: '09/24/2022'
        }
      ]
    });
  })
  it("should be able to get the users currently traveling", () => {
    expect(agent.getUsersCurrentlyTraveling()).to.equal("Bob Johnson")
  });

});