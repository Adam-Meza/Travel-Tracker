import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

class Agent {
  constructor (usersData, tripsData, destinationsData) {
    this.name = "Adam Meza"
    this.usersData = usersData;
    this.tripsData = tripsData;
    this.destinationsData = destinationsData;
  }

  getTotalProfit(trips = this.tripsData) {
    return !trips ? "Check Trips Arguement" : Math.floor(trips.reduce((acc, currentTrip) => {
      return acc += currentTrip.totalPrice
    }, 0) * .10)
  }
  
  getAverageProfit(trips = this.tripsData) {
    return Math.floor(this.getTotalProfit(trips) / trips.length)
  }

  getTotalForYear(year) {
    return /^20(1[89]|2[0-5])$/.test(year) ? 
    Math.floor(this.getTotalProfit(this.tripsData.filter(trip => dayjs(trip.date)['$y'] === year)))
    : "Check Year Arguement"
  }

  getTotalUserAverage() {
    let usersObject = this.arrangeTripsByUserId()
    let totalPerUserArray = Object.keys(usersObject)
      .map(key => ({ totalPrice : this.getTotalProfit(usersObject[key]) }))
    return this.getAverageProfit(totalPerUserArray)
  }

  arrangeTripsByUserId() {
   return this.tripsData.reduce((acc, currentTrip) => {
      !acc[currentTrip.userID] ? acc[currentTrip.userID] = [] : null;
      acc[currentTrip.userID].push(currentTrip)
      return acc 
    }, {})
  }

  getUsersCurrentlyTraveling () {
    return this.tripsData
      .filter(trip => dayjs().isBetween(dayjs(trip.date), dayjs(trip.endDate), null, '[inclusive]', 'day'))
      .reduce((acc, currentTrip) => {
        let userName = this.usersData.find(user => currentTrip.userID === user.id).name
        console.log(acc)
        !acc.includes(userName) ? acc.push(userName) : null;
        return acc
      }, [] )
      .join(", ")
  }
  
}


export default Agent