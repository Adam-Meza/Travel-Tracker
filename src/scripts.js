// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip';
import dayjs from 'dayjs';
import Agent from './clasess/Agent';

// Global Variables

let currentUser,
  destinations,
  randomIndex = Math.floor(Math.random() * 50);

// Query Selectors

const userName = document.getElementById('js-user-name'),
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
  accountBtn = document.getElementById('js-account-btn'),
  overlay = document.querySelector('.overlay'),
  modals = document.querySelectorAll('.modal'),
  modalCloseBtns = [...document.querySelectorAll(".close-modal-btn")],
  modalAccountName = document.getElementById('js-account-name'),
  modalAccountTotal = document.getElementById('js-account-total'),
  accountModal = document.getElementById('js-account-modal'),
  logInBtn = document.getElementById('js-log-in-btn'),
  usernameInput = document.getElementById('js-username-input'),
  passwordInput = document.getElementById('js-password-input')

// Atomic Functions

let makeNewTrip = () => {
  let newDestination = destinations.find(dest => dest.destination === destinationInput.value);
  let newTrip = new Trip({
    id: Date.now(),
    userID: currentUser.id,
    destinationID: newDestination.id,
    duration: dayjs(endDateInput.value).diff(dayjs(startDateInput.value), "days"),
    travelers: numTravelersInput.value,
    status: "pending",
    suggestedActivites: [],
    date: startDateInput.value
  }, newDestination);
  return newTrip;
};

let makeTripArray = (data, userID) => {
  return data
    .filter(trip => trip.userID === Number(userID))
    .map(trip => {
      let destination = destinations.find(dest => dest.id === trip.destinationID);
      return new Trip(trip, destination)
    });
};

let checkIfInputsAreValid = () => {
  let dateRegEx = /^(20[0-3][0-9]|2040)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  let numRegEx = /^([1-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-5])$/

  return inputs.every(input => input.value)
    && destinations.find(dest => dest.destination === destinationInput.value)
    && dateRegEx.test(`${startDateInput.value}`)
    && dateRegEx.test(`${endDateInput.value}`)
    && numRegEx.test(`${numTravelersInput.value}`) ?
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
  userName.innerText = `${user.name.split(" ")[0]}'s Trips`;

  modalAccountName.innerText = `${user.name}`
  modalAccountTotal.innerText = `Total spent on trips this year: $${Math.floor(user.totalSpentOnTrips())}`;
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

inputs.forEach(input => input.addEventListener('submit', () => {
  event.preventDefault();
}));

inputs.forEach(input => input.addEventListener('change', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    inputDisplay.toggleAttribute('hidden')
    inputDisplay.innerText = `Estimated Cost: $${makeNewTrip().totalPrice}`;
  };
}));

newTripBtn.addEventListener('click', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    currentUser.trips.push(makeNewTrip());
    updateInputDOM();
  } else {
    inputDisplay.toggleAttribute('hidden')
    inputDisplay.innerText = "Please fill out all the inputs"
  };
});

let closeModals = () => {
  modals.forEach(modal => modal.classList.remove('active'))
  overlay.classList.remove('active-overlay')
}

modalCloseBtns.forEach(btn => btn.addEventListener('click', () => {
 closeModals()
}))

accountBtn.addEventListener('click', (event) => {
  accountModal.classList.add('active')
  overlay.classList.add('active-overlay')
})

logInBtn.addEventListener('click', () => {
  let userNameRegEx = /^(traveler([1-9]|[1-4][0-9]|50)|agent)$/

  if (userNameRegEx.test(usernameInput.value) && passwordInput.value === 'travel') {
    if (usernameInput.value === "agent") {
      currentUser = new Agent()
      fetchGetAll()
        .then(data => console.log(data))
    } else {
      let userId = usernameInput.value.match(/^traveler([1-9]|[1-4][0-9]|50)$/)[1]
      fetchGetAll(userId)
        .then((data) => {
          destinations = data[2].destinations;
          let trips = makeTripArray(data[1].trips, userId);

          currentUser = new User(data[0], trips);
          console.log(currentUser)

          closeModals()
          displayUserData(currentUser);
          displayTripCards(currentUser.trips);
          populateDestinationList(destinations);
          displayRandomDestination(destinations);
        });
    }
  } else {
    console.log("there was an error")
  }
})
/// this is gonna happen on click instead
// its also going to be just for one when its the 
// window.addEventListener('load', () => {
//   fetchGetAll()
//     .then((data) => {
//       destinations = data[2].destinations;
//       let trips = makeTripArray(data[1].trips, randomIndex);

//       currentUser = new User(data[0].travelers.find(traveler => traveler.id === randomIndex), trips);
//       displayUserData(currentUser);
//       displayTripCards(currentUser.trips);
//       populateDestinationList(destinations);
//       displayRandomDestination(destinations);
//     });
// });

