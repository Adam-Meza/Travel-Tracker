import dayjs from "dayjs";

class Agent {
  constructor (usersData, tripsData, destinationsData) {
    this.name = "Adam Meza"
    this.usersData = usersData;
    this.tripsData = tripsData;
    this.destinationsData = destinationsData;
  }

  getTotalProfit(trips = this.tripsData) {
    return Math.floor(trips.reduce((acc, currentTrip) => {
      return acc += currentTrip.totalPrice
    }, 0) * .10)
  }
  
  getAverageCost(trips = this.tripsData) {
    return Math.floor(this.getTotalProfit(trips) / trips.length)
  }

  getTotalForYear(year) {
    return Math.floor(this.getTotalProfit(this.tripsData.filter(trip => dayjs(trip.startDate)['$y'] === year)))
  }

  getTotalUserAverage() {
    let newObj = this.tripsData.reduce((acc, currentTrip) => {
      !acc[currentTrip.userID] ? acc[currentTrip.userID] = [] : null;
      acc[currentTrip.userID].push(currentTrip)
      return acc 
    }, {})
  
    let totalPerUserArray = Object.keys(newObj).map(key => ({ totalPrice : this.getTotalProfit(newObj[key]) }))
  
    return this.getAverageCost(totalPerUserArray)
  }

  
}


export default Agent