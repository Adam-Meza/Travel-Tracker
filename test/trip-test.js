import chai from 'chai';
const expect = chai.expect;
import Trip from '../src/clasess/Trip';
import { destinations } from './test-data/destination-test-data';
import { trips } from './test-data/trips-test-data';

describe("Trip Class", () => {
  let findDestination = (tripDestId) => destinations.find(dest => dest.id === tripDestId)
  let trip;

  beforeEach(() => {
    trip = new Trip(trips[0], findDestination(trips[0].destinationID))
  });

  it("should hold all the information in properties", () => {
    expect(trip.id).to.equal(1)
    expect(trip.userID).to.equal(4)
    expect(trip.destinationID).to.equal(12)
    expect(trip.date).to.equal('2022/09/16')
    expect(trip.duration).to.equal(8)
    expect(trip.status).to.equal('approved')
    expect(trip.suggestedActivites).to.equal(undefined)
    expect(trip.travelers).to.equal(1)
    expect(trip.image).to.equal('https://images.unsplash.com/photo-1442483221814-59f7d8b22739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')
    expect(trip.destination).to.deep.equal({
      id: 12,
      destination: 'Wellington, New Zealand',
      estimatedLodgingCostPerDay: 150,
      estimatedFlightCostPerPerson: 1200,
      image: 'https://images.unsplash.com/photo-1442483221814-59f7d8b22739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
      alt: 'overview of city with buildings, water and trees'
    })

  });

  it("should hold the data for the destination", () => {
    expect(trip.destination.id).to.equal(12)
    expect(trip.destination.destination).to.equal('Wellington, New Zealand')
    expect(trip.destination.estimatedLodgingCostPerDay).to.equal(150)
    expect(trip.destination.estimatedFlightCostPerPerson).to.equal(1200)
    expect(trip.destination.image).to.equal('https://images.unsplash.com/photo-1442483221814-59f7d8b22739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')
    expect(trip.destination.alt).to.equal('overview of city with buildings, water and trees')
  });

  it("should be able to calculate total price", () => {
    expect(trip.calculatePrice()).to.equal(2640)
    expect(trip.totalPrice).to.equal(2640)
  });

  it("should find the end date for this trip", () => {
    expect(trip.getEndDate()).to.equal('09/24/2022')
  });

  it("should return an error if given an invalid date", () => {
    expect(trip.getEndDate()).to.equal('09/24/2022')
  });

});