// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip'

// Query Selectors 

const userName = document.getElementById('user-name'),
      // userInfo =document.getElementById('user-info'),
      cardContainer = document.getElementById('js-card-container'),
      destinationList = document.getElementById('destinationList'),
      userTotal = document.getElementById('js-user-total'),
      formBackground = document.getElementById('form-background')


window.addEventListener('load', () => {
  fetchGetAll()
    .then((data) => {
      console.log(data)
      let randomIndex = Math.floor(Math.random() * 50)
      let destinations = data[2].destinations
      let trips = data[1].trips
        .filter(trip => trip.userID === randomIndex)
        .map(trip => {
          let destination = destinations.find(dest => dest.id === trip.destinationID)
          return new Trip(trip, destination)})

      let user = new User(data[0].travelers.find(traveler => traveler.id === randomIndex), trips)

      // displayUserData(user)
      displayTripCards(trips)
      populateDestinationList(destinations)
      displayRandomDestination(destinations)
      })
})


let getAllTrips = (user, data) => {
  return data.filter(trip => trip.userID === user.id)
}

let displayTripCards = (trips) => {
  trips.forEach((trip) => {
      cardContainer.innerHTML += `
      <div class="trip-card js-trip-card" tabindex="0">
        <img class="trip-img js-trip-img" tabindex="0" src="${trip.destination.image}"alt="${trip.destination.alt}" >
          <h3 tabindex="0">${trip.destination.destination}</h3>
          <time tabindex="0">${trip.startDate}</time>
          <h5 tabindex="0">${trip.status}</h5>
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

let displayRandomDestination = (data) => {
  let randomIndex = Math.floor(Math.random() * 50)
  let x = data.find(destination => destination.id === randomIndex)
  console.log(x.id)
  formBackground.style.backgroundImage = `url(${x.image})`
}