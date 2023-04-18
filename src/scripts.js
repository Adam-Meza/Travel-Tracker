// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import { fetchGetAll } from './fetches';
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'


console.log('This is the JavaScript entry file - your code begins here.');

window.addEventListener('load', () => {
  fetchGetAll()
    .then(data => console.log(data))
})
