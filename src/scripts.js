// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip'



// Query Selectors 

const userName = document.getElementById('user-name'),
      userInfo =document.getElementById('user-info'),
      cardContainer = document.getElementById('js-card-container');




window.addEventListener('load', () => {
  fetchGetAll()
    .then((data) => {
      console.log(data)

      let user = new User(data[0].travelers.find(traveler => traveler.id === 44))
      let trips = data[1].trips
        .filter(trip => trip.userID === user.id)
        .map(trip => {
          let destination = data[2].destinations.find(dest => dest.id === trip.destinationID)
          return new Trip(trip, destination)})
      userName.innerText = `Welcome back, ${user.name.split(" ")[0]}!`
      displayTripCards(trips)
      console.log(user, trips)
      })
})


let getAllTrips = (user, data) => {
  return data.filter(trip => trip.userID === user.id)
}

let displayTripCards = (trips) => {
  trips.forEach((trip) => {
      cardContainer.innerHTML += `
      <div class="trip-card js-trip-card">
        <img class="trip-img js-trip-img" src="${trip.destination.image}">
        <p>
          <h3>${trip.destination.destination}</h3>
          <time>${trip.startDate}</time>
          <h5>${trip.status}</h5>
        </p>
      </div> `
  })
}

// let calculatePrice = (trip, destinationData) => {
//   return destinationData.find( dest => dest.id === trip.destinationID)
// }
// let displayUserInfo = (user) => {

// }