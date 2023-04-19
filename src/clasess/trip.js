class Trip {
  constructor(tripObj, destination) {
    this.id = tripObj.id,
    this.userID = tripObj.userID,
    this.destinationID = tripObj.destinationID,
    this.startDate = tripObj.date,
    this.duration = tripObj.duration,
    this.status = tripObj.status,
    this.suggestedActivities = tripObj.suggestedActivities
    this.destination = destination
    this.travelers = tripObj.travelers
    this.totalPrice = this.calculatePrice()
    this.image = this.destination.image
  }

  calculatePrice () {
    let totalLogdging = this.duration * this.destination.estimatedLodgingCostPerDay
    let flightCost = this.destination.estimatedFlightCostPerPerson * this.travelers
    let total = (totalLogdging + flightCost) * 1.10

    return total
  }

  // getDestination(destinationData) {
  //   return destinationData.find(dest => dest.id === this.destinationID)
  // }

}



export default Trip