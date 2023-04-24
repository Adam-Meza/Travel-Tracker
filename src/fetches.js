// import { getJson } from "serpapi";

const fetchGet = (url) => {
  return fetch(url)
    .then(data => data.json())
}

const fetchGetAll = (userId) => {
  let userUrl = userId ? `http://localhost:3001/api/v1/travelers/${userId}` : 'http://localhost:3001/api/v1/travelers';
  return Promise.all([
    fetchGet(`${userUrl}`),
    fetchGet("http://localhost:3001/api/v1/trips"),
    fetchGet("http://localhost:3001/api/v1/destinations"),
  ])
}

const postNewTrip = (trip) => {
  return fetch("http://localhost:3001/api/v1/trips", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

const updateTrip = (trip, decision ) => {
  return fetch("http://localhost:3001/api/v1/updateTrip", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      { id: trip.id, 
        status: decision
      })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
}

const deleteTrip = (id) => {
  return fetch(`http://localhost:3001/api/v1/trips/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

export { fetchGetAll }
export { postNewTrip }
export { updateTrip }
export { deleteTrip }