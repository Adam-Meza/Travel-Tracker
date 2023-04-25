import dayjs from "dayjs";

class Trip {
  constructor(tripObj, destination) {
    this.id = tripObj.id,
    this.userID = tripObj.userID,
    this.destinationID = tripObj.destinationID,
    this.date = tripObj.date,
    this.duration = tripObj.duration,
    this.status = tripObj.status,
    this.suggestedActivities = tripObj.suggestedActivities
    this.travelers = tripObj.travelers
    this.destination = destination
    this.image = this.destination.image
    this.totalPrice = Math.floor(this.calculatePrice())
    this.endDate = this.getEndDate()
  }

  calculatePrice () {
    let totalLogdging = this.duration * this.destination.estimatedLodgingCostPerDay
    let flightCost = this.destination.estimatedFlightCostPerPerson * this.travelers
    let total = (totalLogdging + flightCost) * 1.10
    return total
  }

  getEndDate() {
    return dayjs(this.date).add(this.duration, "days").format('MM/DD/YYYY')
  }
}

export default Trip