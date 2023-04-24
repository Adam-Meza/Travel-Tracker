class User {
  constructor (travelerObj, trips) {
    this.id = travelerObj.id,
    this.name = travelerObj.name,
    this.travelerType = travelerObj.travelerType
    this.trips = trips
  }

  totalSpentOnTrips () {
    return !this.trips ? "Trips Data is undefined" : this.trips.reduce((acc, currentTrip) => {
      return acc += currentTrip.totalPrice
    }, 0) ;
  }
  
}




export default User