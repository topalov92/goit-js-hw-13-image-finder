const MAIN_URL = 'https://restcountries.com'

function fetchCountries(text) {
    return  fetch(`${MAIN_URL}/v2/name/${text}`).then(response =>
        response.json(),
        );
}
export default { fetchCountries };