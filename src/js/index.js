import '../style.css';
import CountryInfoTpl from '../templates/country-info.hbs';
import CountryItemstTpl from '../templates/country-items.hbs';
import API from './fetchCountries';
import getRefs from './refs';
import * as _ from "lodash";

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const refs = getRefs();

refs.searchInput.addEventListener("input", _.debounce(onInputChange, 500));

function onInputChange(evt) {
    evt.preventDefault();

const searchQuery = evt.target.value;

API.fetchCountries(searchQuery)
    .then(renderCountryInfo)
    .catch(onFetchError)
    .finally(() => refs.searchInput.value === '');
}

function onFetchError() {
    error({
    title: false,
    text: 'No matches found, enter more letters from your country name!',
    shadow: true,
    delay: 1000,
})}

function renderCountryInfo(country) {
    refs.countryInfo.innerHTML = '';
    if(country.length === 1) {
    const countryMurkup = CountryInfoTpl(country);
    refs.countryInfo.innerHTML = countryMurkup;
    } else if (country.length > 1 && country.length < 8) {
        const murkupCountries = CountryItemstTpl (country);
        refs.countryInfo.innerHTML = murkupCountries;
    } else {
        onFetchError();
    }
}