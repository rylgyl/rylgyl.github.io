let breeds = [];
let breed = 'affenpinscher';

const BREEDS_LIST = 'https://dog.ceo/api/breeds/list/all';
const BREEDS_URL = `https://dog.ceo/api/breed/${breed}/images/random`;
const spinner = document.querySelector('.spinner');

function showDoggo() {
    spinner.classList.add("show");
    fetch(BREEDS_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            spinner.classList.remove("show");
            const img = document.createElement('img');
            img.src = data.message;
            img.alt = 'Cute doggo';

            const selectElement = document.querySelector('.dogImage');
            selectElement.appendChild(img);

        });

}

function init() {
    fetch(BREEDS_LIST)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            breeds = Object.keys(data.message);
            
            breeds.forEach(item => {
                const selectElement = document.querySelector('.breedOptions');
                const option = document.createElement('option');
                option.value = item;
                option.innerText = item;
                selectElement.appendChild(option);
            });
        })
        .then(showDoggo());
    
    document.querySelector('.breedOptions').addEventListener('change', function(event) {
        const selectElement = document.querySelector('.dogImage');
        selectElement.innerHTML = '';
        const selectedBreed = event.target.value;
        breed = selectedBreed;
        showDoggo();
    });
}

init();