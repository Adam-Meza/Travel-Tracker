// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip';
import dayjs from 'dayjs';

// Global Variables

let currentUser,
   destinations,
   randomIndex = Math.floor(Math.random() * 50);

// Query Selectors

const userName = document.getElementById('user-name'),
      // userInfo = document.getElementById('user-info'),
      formBackground = document.getElementById('form-background'),
      newTripBtn = document.getElementById('new-trip-btn'),
      inputs = [...document.querySelectorAll('input')],
      inputDisplay = document.getElementById('js-input-display'),
      numTravelersInput = document.getElementById('js-num-travelers-input'),
      destinationInput = document.getElementById('js-destination-input'),
      startDateInput = document.getElementById('js-start-date'),
      endDateInput = document.getElementById('js-end-date'),
      destinationList = document.getElementById('destinationList'),
      cardContainer = document.getElementById('js-card-container'),
      userTotal = document.getElementById('js-user-total'),
      testInput = document.getElementById('test')

// Atomic Functions

let makeNewTrip = () => {
  let newDestination = destinations.find(dest => dest.destination === destinationInput.value);
  let newTrip = new Trip ({
    id: Date.now(),
    userID: currentUser.id,
    destinationID: newDestination.id,
    duration: dayjs(endDateInput.value).diff(dayjs(startDateInput.value), "days"),
    travelers: numTravelersInput.value,
    status: "Pending",
    suggestedActivites: [],
    date: startDateInput.value
  }, newDestination);
  return newTrip;
};

let makeTripArray = (data, userID) => {
  return data
    .filter(trip => trip.userID === userID)
    .map(trip => {
      let destination = destinations.find(dest => dest.id === trip.destinationID);
      return new Trip(trip, destination)});
};

let checkIfInputsAreValid = () => {
  let dateRegEx = /^(20[0-3][0-9]|2040)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  
  return inputs.every(input => input.value)
  && destinations.find(dest => dest.destination === destinationInput.value)
  && dateRegEx.test(`${startDateInput.value}`)
  && dateRegEx.test(`${endDateInput.value}`) ?
  true : false;
};

// DOM functions 

let displayTripCards = (trips) => {
  trips.forEach((trip) => {
      cardContainer.innerHTML += `
      <div class="trip-card js-trip-card" tabindex="0">
        <img class="trip-img js-trip-img" src="${trip.destination.image}"alt="${trip.destination.alt}" >
        <h3>${trip.destination.destination}</h3>
        <time" name="travel-dates" >${dayjs(trip.startDate).format('MM/DD/YYYY')} - ${dayjs(trip.startDate).add(trip.duration, "days").format('MM/DD/YYYY')}</time>
        <h4 class="${trip.status}">${trip.status}</h5>
      </div> `
  });
};

let displayUserData = (user) => {
  userName.innerText = `Welcome back, ${user.name.split(" ")[0]}!`;
  userTotal.innerText = `Total spent on trips this year: $${ Math.floor(user.totalSpentOnTrips())}`;
};

let populateDestinationList = (destinations) => {
  destinations.forEach((destination) => {
    destinationList.innerHTML += `<option value="${destination.destination}">`;
  });
};

let displayRandomDestination = (destinationData) => {
  let randomIndex = Math.floor(Math.random() * 50);
  let randomDestination = destinationData[randomIndex];
  formBackground.style.backgroundImage = `url(${randomDestination.image})`;
};

let updateInputDOM = () => {
  inputDisplay.toggleAttribute('hidden');
  displayTripCards(currentUser.trips);
  inputs.forEach(input => input.value = null);
  inputDisplay.toggleAttribute('hidden');
};

// Event Listeners

const today = dayjs().format('YYYY-MM-DD');
startDateInput.setAttribute('min', today);
endDateInput.setAttribute('min', today);

startDateInput.addEventListener('change', () => {

  endDateInput.disabled = false; 
  endDateInput.setAttribute('min', startDateInput.value);
});

// endDateInput.addEventListener('change', () => {
//   startDateInput.setAttribute('max', startDateInput.value);
// });


inputs.forEach(input => input.addEventListener('submit', () => {
  event.preventDefault();
}));

inputs.forEach(input => input.addEventListener('change', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    inputDisplay.toggleAttribute('hidden')
    inputDisplay.innerText = `Estimated Cost: $${ makeNewTrip().totalPrice}`;
  };
}));

newTripBtn.addEventListener('click', () => {
  event.preventDefault()
  if (checkIfInputsAreValid()) {
    currentUser.trips.push(makeNewTrip())
    updateInputDOM()
  } else {
    inputDisplay.toggleAttribute('hidden')
    inputDisplay.innerText = "Please fill out all the inputs"
  };
});


window.addEventListener('load', () => {
  fetchGetAll()
    .then((data) => {
      destinations = data[2].destinations;
      let trips = makeTripArray(data[1].trips, randomIndex);

      currentUser = new User(data[0].travelers.find(traveler => traveler.id === randomIndex), trips);

      console.log(destinations)
      displayUserData(currentUser);
      displayTripCards(currentUser.trips);
      populateDestinationList(destinations);
      displayRandomDestination(destinations);
      });
});