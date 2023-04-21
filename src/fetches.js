//just one
//http://localhost:3001/api/v1/travelers/[x]
// where x is a number 1-50

// MODIFY A SINGLE TRIP 

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

export { fetchGetAll }