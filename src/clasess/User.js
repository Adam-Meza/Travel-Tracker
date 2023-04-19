class User {
  constructor (travelerObj, trips) {
    this.id = travelerObj.id,
    this.name = travelerObj.name,
    this.travelerType = travelerObj.travelerType
    this.trips = trips
  }

  totalSpentOnTrips () {
    return this.trips.reduce((acc, currentTrip) => {
      console.log(currentTrip.totalPrice)
      return acc += currentTrip.totalPrice
    }, 0)
  }
}




export default User