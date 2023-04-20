// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip'
import datepicker from '../node_modules/js-datepicker';
import dayjs from 'dayjs';

// Global Variables

let currentUser,
   destinations;

// Query Selectors 

const userName = document.getElementById('user-name'),
      userInfo = document.getElementById('user-info'),
      cardContainer = document.getElementById('js-card-container'),
      destinationList = document.getElementById('destinationList'),
      userTotal = document.getElementById('js-user-total'),
      formBackground = document.getElementById('form-background'),
      startDate = document.getElementById('js-start-date'),
      endDate = document.getElementById('js-end-date'),
      newTripBtn = document.getElementById('new-trip-btn'),
      inputs = [...document.querySelectorAll('input')],
      inputDisplay = document.getElementById('js-input-display'),
      numTravelersInput = document.getElementById('js-num-travelers-input'),
      destinationInput = document.getElementById('js-destination-input');


// Atomic Functions 

let displayTripCards = (trips) => {
  trips.forEach((trip) => {
      cardContainer.innerHTML += `
      <div class="trip-card js-trip-card" tabindex="0">
        <img class="trip-img js-trip-img" tabindex="0" src="${trip.destination.image}"alt="${trip.destination.alt}" >
          <h3 tabindex="0">${trip.destination.destination}</h3>
          <time tabindex="0" name="travel-dates" >${dayjs(trip.startDate).format('MM/DD/YYYY')} - ${dayjs(trip.startDate).add(trip.duration, "days").format('MM/DD/YYYY')}</time>
          <h4 tabindex="0">${trip.status}</h5>
      </div> `
  })
}

let displayUserData = (user) => {
  userName.innerText = `Welcome back, ${user.name.split(" ")[0]}!`
  userTotal.innerText = `Total spent on trips this year: $${ Math.floor(user.totalSpentOnTrips())}`
}

let populateDestinationList = (destinations) => {
  destinations.forEach((destination) => {
    destinationList.innerHTML += `<option value="${destination.destination}">`
  })
}

let displayRandomDestination = (destinationData) => {
  let randomIndex = Math.floor(Math.random() * 50)
  let randomDestination = destinationData[randomIndex]
  formBackground.style.backgroundImage = `url(${randomDestination.image})`
}



// Event Listeners

const today = dayjs().format('YYYY-MM-DD');
startDate.setAttribute('min', today);
endDate.setAttribute('min', today);


startDate.addEventListener('change', () => {
  endDate.disabled = false
  endDate.setAttribute('min', startDate.value);
})

inputs.forEach(input => input.addEventListener('submit', () => {
  event.preventDefault()
}))

newTripBtn.addEventListener('click', () => {
  event.preventDefault()
  if (inputs.some(input => !input.value)) {
    inputDisplay.innerText = "Please fill in all the inputs"
  } else {
    let newDestination = destinations.find(dest => dest.destination === destinationInput.value)

    let newTrip = new Trip ({
      id: Date.now(),
      userID: currentUser.id,
      destinationID: newDestination.id,
      duration: dayjs(endDate.value).diff(dayjs(startDate.value), "days"),
      travelers: numTravelersInput.value,
      status: "Pending",
      suggestedActivites: [],
      date: startDate
    }, newDestination)
    console.log(newTrip)
  }
})

window.addEventListener('load', () => {
  fetchGetAll()
    .then((data) => {
      let randomIndex = Math.floor(Math.random() * 50)
        destinations = data[2].destinations
      let trips = data[1].trips
        .filter(trip => trip.userID === randomIndex)
        .map(trip => {
          let destination = destinations.find(dest => dest.id === trip.destinationID)
          return new Trip(trip, destination)})

      currentUser = new User(data[0].travelers.find(traveler => traveler.id === randomIndex), trips)
      console.log(currentUser)
      displayUserData(currentUser)
      displayTripCards(trips)
      populateDestinationList(destinations)
      displayRandomDestination(destinations)
      })
});






