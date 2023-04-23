// Import
import './css/styles.css';
import User from './clasess/User.js'
import Trip from './clasess/Trip';
import dayjs from 'dayjs';
import Agent from './clasess/Agent';
import { displayYearlyProfitChart } from './charts';
import { postNewTrip } from './fetches';
import { updateTrip } from './fetches';
import { deleteTrip } from './fetches';
import { fetchGetAll } from './fetches';

// Global Variables
let currentUser,
  destinations;

// Query Selectors
const mainTitle = document.getElementById('js-main-title'),
  formBackground = document.getElementById('js-form-background'),
  mainBox = document.getElementById('js-main'),

  newTripBtn = document.getElementById('new-trip-btn'),
  newTripInputs = [...document.querySelectorAll('new-trip-input')],
  numTravelersInput = document.getElementById('js-num-travelers-input'),
  destinationInput = document.getElementById('js-destination-input'),
  destinationList = document.getElementById('destinationList'),
  startDateInput = document.getElementById('js-start-date'),
  endDateInput = document.getElementById('js-end-date'),
  inputErrorDisplay = document.getElementById('js-input-error-display'),
  cardContainer = document.getElementById('js-card-container'),
  
  modals = document.querySelectorAll('.modal'),
  overlay = document.querySelector('.overlay'),
  modalCloseBtns = [...document.querySelectorAll(".close-modal-btn")],
  modalAccountName = document.getElementById('js-account-name'),
  modalAccountTotal = document.getElementById('js-account-total'),
  accountModal = document.getElementById('js-account-modal'),

  logInModal = document.getElementById('js-log-in-modal'),
  logInBtn = document.getElementById('js-log-in-btn'),
  usernameInput = document.getElementById('js-username-input'),
  passwordInput = document.getElementById('js-password-input'),

  agentViewContainer = document.getElementById("js-agent-container"),
  yearlyProfitChart = document.getElementById('js-yearly-profit-chart'),

  financesDataPoints = [...document.querySelectorAll('.js-finances-data')],
  requestBtn = document.getElementById('js-request-btn'),
  financesBox = document.getElementById('js-finances-box'),
  financesBtn = document.getElementById('js-finances-btn'),
  requestsBox = document.getElementById('js-request-box'),
  requestsCardsBox = document.getElementById('js-requests-cards-box'),
  agentNavBtns = [...document.querySelectorAll('.agent-nav-btn')],
  accountBtn = document.getElementById('js-account-btn'),
  logOutBtn = document.getElementById("js-log-out-btn")

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
    suggestedActivities: [],
    date: dayjs(startDateInput.value).format("YYYY/MM/DD")
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

let closeModals = () => {
  modals.forEach(modal => modal.classList.remove('active'))
  overlay.classList.remove('active-overlay')
}

let displayTripCards = (trips) => {
  cardContainer.hidden = false
  cardContainer.innerHTML = ''
  trips.forEach((trip) => {
    cardContainer.innerHTML += `
      <div class="trip-card js-trip-card" tabindex="0">
        <img class="trip-img js-trip-img" src="${trip.destination.image}"alt="${trip.destination.alt}" >
        <h3>${trip.destination.destination}</h3>
        <time" name="travel-dates" >${ dayjs(trip.date).format('MM/DD/YYYY') } - ${trip.endDate}</time>
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

let updateInputDOM = () => {
  displayTripCards(currentUser.trips);
  inputErrorDisplay.toggleAttribute('hidden');
  newTripInputs.forEach(input => input.value = null);
};

// Agent Mode DOM

let displayAgentPortal = () => {
  cardContainer.hidden = false
  agentViewContainer.hidden = false
  mainTitle.innerText = 'Agent Portal'
}

let setAgentUser = (data, charts) => {
  destinations = data[2].destinations;
  currentUser = new Agent(data[0].travelers, makeTripArray(data[1].trips), data[2].destinations);

  closeModals();
  displayAgentPortal();
  displayRequestCards(currentUser.tripsData.filter(trip => trip.status === "pending"));
  charts ? displayFinanceData() : null;
}

let handleNav = () => {
  financesBtn.toggleAttribute('hidden');
  financesBox.toggleAttribute('hidden');
  requestsBox.toggleAttribute('hidden');
  requestBtn.toggleAttribute('hidden');
}

let displayFinanceData = () => {
  let totalFinanceData = [
    currentUser.getTotalProfit(), 
    currentUser.getTotalForYear(2023),
    currentUser.getTotalForYear(2022),
    currentUser.getAverageCost(),
    currentUser.getTotalUserAverage(),
    currentUser.getUsersCurrentlyTraveling()
  ]

  financesDataPoints.forEach((span, index) => span.innerHTML = `${totalFinanceData[index]}`)
  displayYearlyProfitChart(yearlyProfitChart, dataForYearlyChart())
}

let dataForYearlyChart = () => {
  let years = [2019, 2020, 2021, 2022, 2023]
  return years.map(year => ( { profit: currentUser.getTotalForYear(year), year: year}))
}

let displayRequestCards = (trips) => {
  requestsCardsBox.innerHTML = trips.map(trip => `
  <div class="request-card">
  <img src="${trip.destination.image}"alt="${trip.destination.alt}" >
  <div>
      <p> User Name: ${ currentUser.usersData.find(user => user.id === trip.userID).name } | User ID: ${ trip.userID } </p>
      <p> Destination: ${ trip.destination.destination } </p>
      <p> ${ dayjs(trip.date).format('MM/DD/YYYY') } - ${ trip.endDate } </p>
      <p> Duration: ${ trip.duration } days | Number of travelers: ${ trip.travelers } </p>

    </div>
    <div>
      <p>Total Profit: $${ Math.floor( trip.totalPrice * .10) } | Status: <span class="${trip.status}"> ${trip.status}</span> </p>
      <div class="request-btn-box" id=${ trip.id } >
          <button class="approved">Approve</button>
          <button class="denied">Deny</button>
      </div>
    </div>
  </div>`
  ).join('')
}

// Event Listeners
// New Trip Inputs/Button Event Listeners

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

startDateInput.setAttribute('min', dayjs().format('YYYY-MM-DD'));
endDateInput.setAttribute('min', dayjs().format('YYYY-MM-DD'));

startDateInput.addEventListener('change', () => {
  endDateInput.disabled = false;
  endDateInput.setAttribute('min', startDateInput.value);
});

newTripBtn.addEventListener('click', () => {
  event.preventDefault();
  if (checkIfInputsAreValid()) {
    postNewTrip(makeNewTrip())
    .then(() => {
      currentUser.trips.push(makeNewTrip());
      updateInputDOM();
    })
  } else {
    inputErrorDisplay.toggleAttribute('hidden');
    inputErrorDisplay.innerText = "Please fill out all the inputs";
  };
});

//Login Modal Event Listeners

modalCloseBtns.forEach(btn => btn.addEventListener('click', () => {
  closeModals();
}))

logOutBtn.addEventListener('click', () => {
  hideOrShowMain()
  agentViewContainer.setAttribute('hidden', true)
  formBackground.setAttribute('hidden', true)
  cardContainer.innerHTML = "true"
  accountModal.classList.remove('active')
  logInModal.classList.add('active')
})

let hideOrShowMain = () => {
  mainBox.toggleAttribute('hidden')
}

logInBtn.addEventListener('click', () => {
  let userNameRegEx = /^(traveler([1-9]|[1-4][0-9]|50)|agent)$/;

  if (userNameRegEx.test(usernameInput.value) && passwordInput.value === 'travel') {
    if (usernameInput.value === "agent") {
      fetchGetAll()
        .then((data) => {
          hideOrShowMain()
          setAgentUser(data, true)
        })
    } else {
      let userId = usernameInput.value.match(/^traveler([1-9]|[1-4][0-9]|50)$/)[1]
      fetchGetAll(userId)
        .then((data) => {
          destinations = data[2].destinations;
          let trips = makeTripArray(data[1].trips, userId);
          currentUser = new User(data[0], trips);

          closeModals()
          
          hideOrShowMain()
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
});

// Agent Mode Event Listeners

requestsBox.addEventListener('click', (event) => {
  if (event.target.classList.contains('approved')) {
    updateTrip(currentUser.tripsData.find(trip => trip.id === Number (event.target.parentNode.id)), `${event.target.classList}`)
    .then(() => {
      fetchGetAll()
        .then((data) => {
          setAgentUser(data, false);
         })
    })
  } else if (event.target.classList.contains('denied')) {
    deleteTrip(event.target.parentNode.id)
    .then(() => {
      fetchGetAll()
      .then((data) => {
        setAgentUser(data, false);
       })
    })
  }
})

accountBtn.addEventListener('click', (event) => {
  accountModal.classList.add('active');
  overlay.classList.add('active-overlay');
})

agentNavBtns.forEach(btn => btn.addEventListener('click', () => handleNav()));



