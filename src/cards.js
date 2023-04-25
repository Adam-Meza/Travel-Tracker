import dayjs from 'dayjs';

const cardBox = document.getElementById('js-card-box'),
requestsCardsBox = document.getElementById('js-requests-cards-box');

const displayTripCards = (trips) => {
  cardBox.hidden = false;
  cardBox.innerHTML = '';
  
  trips.forEach((trip) => {
    cardBox.innerHTML += `
      <div class="trip-card js-trip-card" tabindex="0">
        <img class="trip-img js-trip-img" src="${trip.destination.image}"alt="${trip.destination.alt}" >
        <h3 class="card-destination" >${trip.destination.destination}</h3>
        <time class="card-date" name="travel-dates">${ dayjs(trip.date).format('MM/DD/YYYY') } - ${trip.endDate}</time>
        <div>
          <h4 class="${trip.status} card-status">${trip.status}</h4>
          <button class="view-details js-view-details" id="${trip.id}">View Details</button>
        </div>
      </div> `
  });
};

let displayRequestCards = (trips, currentUser) => {
  requestsCardsBox.innerHTML += trips.map(trip => `
  <div class="request-card">
  <img src="${trip.destination.image}"alt="${trip.destination.alt}" >
    <div>
      <p> User Name: ${ currentUser.usersData.find(user => user.id === trip.userID).name } | User ID: ${ trip.userID } </p>
      <p> Destination: ${ trip.destination.destination } </p>
      <p> ${ dayjs(trip.date).format('MM/DD/YYYY') } - ${ trip.endDate } </p>
      <p> Duration: ${ trip.duration } days | Number of travelers: ${ trip.travelers } </p>
    </div>
    <div>
      <p class="status-box">Total Profit: $${ Math.floor( trip.totalPrice * .10) } | Status:  <span class="${trip.status}"> ${trip.status}</span> </p>
      <div class="request-btn-box" id=${ trip.id } >
          <button class="approved">Approve</button>
          <button class="denied">Deny</button>
      </div>
    </div>
  </div>`
  ).join('');
};

let displayUserCards = (trips, currentUser) => {
  requestsCardsBox.innerHTML += trips.map(trip => `
  <div class="request-card">
  <img src="${trip.destination.image}"alt="${trip.destination.alt}" >
    <div>
      <p> User Name: ${ currentUser.usersData.find(user => user.id === trip.userID).name } | User ID: ${ trip.userID } </p>
      <p> Destination: ${ trip.destination.destination } </p>
      <p> ${ dayjs(trip.date).format('MM/DD/YYYY') } - ${ trip.endDate } </p>
      <p> Duration: ${ trip.duration } days | Number of travelers: ${ trip.travelers } </p>
    </div>
    <div class="approvde-status-box">
      <p>Total Profit: $${ Math.floor( trip.totalPrice * .10) }
      <p class="status-box"> Status:  <span class="${trip.status}"> ${trip.status}</span> </p>
    </div>
  </div>`
  ).join('');
};

export { displayTripCards };
export { displayRequestCards };
export { displayUserCards };