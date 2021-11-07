import './sass/main.scss';

const debounce = require('lodash.debounce');
import { error, alert } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox'
import "basiclightbox/dist/basicLightbox.min.css"

import NewApiServises from './apiService.js';
import photoCardMarcup from './partials/photo-card.hbs';

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

const newApiServises = new NewApiServises();

refs.searchForm.addEventListener('input', debounce(onInputSearchPhoto, 500));
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.galleryContainer.addEventListener('click', onClickBigImg);



function onInputSearchPhoto(event) {
    const inputValue = event.target.value;


    cleareGallaryContainer();
    newApiServises.query = inputValue;

    if (newApiServises.query === '') {
        refs.loadMoreBtn.classList.add('is-hidden');
        alert({
            text: 'Please, enter the text',
            delay: 1000,
        });
        return;
    };

    newApiServises.resetPage();
    newApiServises.fetchPhoto()
        .then(renderPhotoCard)
        .catch(error => console.log(error));
};

function renderPhotoCard(hits) {

    if (hits.length === 0) {
        error({
            text: 'Invalid request',
            delay: 1000,
        });
        return;
    }

    addMarkup(hits);

    // end window
    setTimeout(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    }, 500);

};

function cleareGallaryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function addMarkup(element) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', photoCardMarcup(element));
    refs.loadMoreBtn.classList.remove('is-hidden');
};

function onLoadMore(event) {
    newApiServises.fetchPhoto()
        .then(renderPhotoCard);
};

// basicLightbox 

function onClickBigImg(event) {
    if (event.target.tagName !== 'IMG') return false;

    const imgSrc = event.target.getAttribute('big-src');

    const instance = basicLightbox
        .create(`<img src="${imgSrc}" width="800" height="600">`)

    instance.show()

    window.addEventListener('click', onClickWindowLightboxClose)
};

function onClickWindowLightboxClose(event) {
    if (event.code === 'Escape') {
        instance.close(() => console.log('lightbox not working'));
    }
};