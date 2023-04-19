// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip'

// Query Selectors 

const userName = document.getElementById('user-name'),
      userInfo =document.getElementById('user-info'),
      cardContainer = document.getElementById('js-card-container'),
      destinationList = document.getElementById('destinationList'),
      userTotal = document.getElementById('js-user-total')


window.addEventListener('load', () => {
  fetchGetAll()
    .then((data) => {
      console.log(data)
      let destinations = data[2].destinations
      let trips = data[1].trips
        .filter(trip => trip.userID === 1)
        .map(trip => {
          let destination = destinations.find(dest => dest.id === trip.destinationID)
          return new Trip(trip, destination)})

      let user = new User(data[0].travelers.find(traveler => traveler.id === 1), trips)

      displayUserData(user)
      displayTripCards(trips)
      populateDestinationList(destinations)
      console.log(user.totalSpentOnTrips())
      })
})


let getAllTrips = (user, data) => {
  return data.filter(trip => trip.userID === user.id)
}

let displayTripCards = (trips) => {
  trips.forEach((trip) => {
      cardContainer.innerHTML += `
      <div class="trip-card js-trip-card">
        <img class="trip-img js-trip-img" src="${trip.destination.image}"alt="${trip.destination.alt}" >
          <h3>${trip.destination.destination}</h3>
          <time>${trip.startDate}</time>
          <h5>${trip.status}</h5>
      </div> `
  })
}

let displayUserData = (user) => {
  userName.innerText = `Welcome back, ${user.name.split(" ")[0]}!`
  userTotal.innerText = `Total spent on trips this year: ${user.totalSpentOnTrips()}`
}

let populateDestinationList = (destinations) => {
  destinations.forEach((destination) => {
    destinationList.innerHTML += `
      <option value="${destination.destination}">
      `
  })
}