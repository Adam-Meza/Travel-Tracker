// Import
import { fetchGetAll } from './fetches';
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip';
import dayjs from 'dayjs';
import Agent from './clasess/Agent';
import { displayYearlyProfitChart } from './charts';
import { displayUsersChart } from './charts';

// Global Variables

let currentUser,
  destinations;

// Query Selectors

const mainTitle = document.getElementById('js-main-title'),
  formBackground = document.getElementById('js-form-background'),
  newTripBtn = document.getElementById('new-trip-btn'),
  newTripInputs = [...document.querySelectorAll('new-trip-input')],
  inputErrorDisplay = document.getElementById('js-input-error-display'),
  numTravelersInput = document.getElementById('js-num-travelers-input'),
  destinationInput = document.getElementById('js-destination-input'),
  startDateInput = document.getElementById('js-start-date'),
  endDateInput = document.getElementById('js-end-date'),
  destinationList = document.getElementById('destinationList'),
  cardContainer = document.getElementById('js-card-container'),
  accountBtn = document.getElementById('js-account-btn'),
  overlay = document.querySelector('.overlay'),
  modals = document.querySelectorAll('.modal'),
  modalCloseBtns = [...document.querySelectorAll(".close-modal-btn")],
  modalAccountName = document.getElementById('js-account-name'),
  modalAccountTotal = document.getElementById('js-account-total'),
  accountModal = document.getElementById('js-account-modal'),
  logInBtn = document.getElementById('js-log-in-btn'),
  usernameInput = document.getElementById('js-username-input'),
  passwordInput = document.getElementById('js-password-input'),
  agentViewContainer = document.getElementById("js-agent-container"),
  yearlyProfitChart = document.getElementById('js-yearly-profit-chart'),
  usersChart = document.getElementById('js-users-chart'),
  totalDataPoints = [...document.querySelectorAll('.js-total')],
  usersFinanceDataPoints = [...document.querySelectorAll('.js-users')]

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
  userID ? data = data.filter(trip => trip.userID === Number(userID)) : null ; 
  return data .map(trip => {
      let destination = destinations.find(dest => dest.id === trip.destinationID);
      return new Trip(trip, destination)
  });
};

let checkIfInputsAreValid = () => {
  let dateRegEx = /^(20[0-3][0-9]|2040)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  let numRegEx = /^([1-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-5])$/

  return newTripInputs.every(input => input.value)
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
  mainTitle.innerText = `${user.name.split(" ")[0]}'s Trips`;

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
  formBackground.toggleAttribute('hidden')
  formBackground.style.backgroundImage = `url(${randomDestination.image})`;
};

let displayFinanceData = () => {
  let totalFinanceData = [
    currentUser.getTotalProfit(), 
    currentUser.getTotalForYear(2023),
    currentUser.getTotalForYear(2022),
    currentUser.getAverageCost()
  ]

  totalDataPoints.forEach((span, index) => span.innerHTML = `$${totalFinanceData[index]}`)



  let usersFinanceData = [
    currentUser.getTotalUserAverage()
    // currentUser
    


  ]

  usersFinanceDataPoints.forEach((span, index) => span.innerHTML = `$${usersFinanceData[index]}`)

}

let updateInputDOM = () => {
  inputErrorDisplay.toggleAttribute('hidden');
  displayTripCards(currentUser.trips);
  newTripInputs.forEach(input => input.value = null);
};


// Event Listeners

const today = dayjs().format('YYYY-MM-DD');
startDateInput.setAttribute('min', today);
endDateInput.setAttribute('min', today);

startDateInput.addEventListener('change', () => {
  endDateInput.disabled = false;
  endDateInput.setAttribute('min', startDateInput.value);
});

newTripInputs.forEach(input => input.addEventListener('submit', () => {
  event.preventDefault();
}));

newTripInputs.forEach(input => input.addEventListener('change', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    inputErrorDisplay.toggleAttribute('hidden');
    inputErrorDisplay.innerText = `Estimated Cost: $${makeNewTrip().totalPrice}`;
  };
}));

newTripBtn.addEventListener('click', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    currentUser.trips.push(makeNewTrip());
    updateInputDOM();
  } else {
    inputErrorDisplay.toggleAttribute('hidden');
    inputErrorDisplay.innerText = "Please fill out all the inputs";
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

let displayAgentPortal = () => {
  cardContainer.toggleAttribute('hidden')
  agentViewContainer.toggleAttribute('hidden')
  mainTitle.innerText = 'Agent Portal'
  displayUsersChart(usersChart)
  displayYearlyProfitChart(yearlyProfitChart)
}

logInBtn.addEventListener('click', () => {
  let userNameRegEx = /^(traveler([1-9]|[1-4][0-9]|50)|agent)$/;

  if (userNameRegEx.test(usernameInput.value) && passwordInput.value === 'travel') {
    if (usernameInput.value === "agent") {
      fetchGetAll()
        .then((data) => {
          destinations = data[2].destinations;
          currentUser = new Agent(data[0].travelers, makeTripArray(data[1].trips), data[2].destinations);
          console.log(currentUser.getTotalUserAverage())

          closeModals();
          displayAgentPortal();
          displayFinanceData()
        })
    } else {
      let userId = usernameInput.value.match(/^traveler([1-9]|[1-4][0-9]|50)$/)[1]
      fetchGetAll(userId)
        .then((data) => {
          destinations = data[2].destinations;
          let trips = makeTripArray(data[1].trips, userId);
          currentUser = new User(data[0], trips);

          closeModals()
          
          displayUserData(currentUser);
          displayTripCards(currentUser.trips);
          populateDestinationList(destinations);
          displayRandomDestination(destinations);
        })
        .catch(err => console.log(err));
    }
  } else {
    console.log("there was an error");
  }
})
