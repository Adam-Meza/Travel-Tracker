//just one
//http://localhost:3001/api/v1/travelers/[x]
// where x is a number 1-50

// MODIFY A SINGLE TRIP 

const fetchGet = (url) => {
  return fetch(url)
    .then(data => data.json())
}

const fetchGetAll = () => {
  return Promise.all([
    fetchGet("http://localhost:3001/api/v1/travelers"),
    fetchGet("http://localhost:3001/api/v1/trips"),
    fetchGet("http://localhost:3001/api/v1/destinations"),
  ])
}

export { fetchGetAll }