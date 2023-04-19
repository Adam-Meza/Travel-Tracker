
import { fetchGetAll } from './fetches';
import './css/styles.css';



console.log('This is the JavaScript entry file - your code begins here.');

window.addEventListener('load', () => {
  fetchGetAll()
    .then(data => console.log(data))
})
