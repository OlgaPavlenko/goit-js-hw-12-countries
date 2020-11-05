import countryCardTpl from '../templates/country-card.hbs';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import {alert, error} from '@pnotify/core';

const debounce = require('lodash.debounce');

const refs = {
    cardContainer: document.querySelector('.js-card-container'),
    searchInput: document.querySelector('.js-search-input'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, 2000));

function onSearch (event) {
    event.preventDefault();
    refs.cardContainer.innerHTML = '';

  const searchQuery = refs.searchInput.value;

    if (searchQuery.trim() === '')
        return;
    
fetchCountryByName(searchQuery).then(renderView)
.catch(error => {
        alert("you entered unknown country!");
})
}

function fetchCountryByName (countryName) {
    return fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
                .then(response =>
                                    { 
                                        if(response.ok) {
                                        //    console.log(response);
                                            return response.json()
                                        } else {
                                            throw new Error(response.statusText)
                                        }
                                    })
    }

function renderCountryCard(countries) {
    //countries.map(country => refs.cardContainer.insertAdjacentHTML('beforeend', countryCardTpl(country)));
    refs.cardContainer.insertAdjacentHTML('beforeend', countryCardTpl(countries[0]));
}

function listOfCountriesMarkup(countries) {
    const ul = document.createElement('ul');
    ul.innerHTML = countries.map(country => `<li class='markered-list'>${country.name}</li>`).join('')
    console.log(ul);
    return ul;
}

function countriesCounter(countries) { 
   return Object.keys(countries).length;
}

function renderView(countries) {
    const count = countriesCounter(countries);
    if (count >= 10) {
          const errorMessage = new error({
              dir1: 'up',
              text: 'To many matches found. Please enter a more specific query'
          });
          
    } else if (count >= 2) {
        refs.cardContainer.innerHTML = '';
        refs.cardContainer.appendChild(listOfCountriesMarkup(countries));
    } else { 
        renderCountryCard(countries);
    }
}

