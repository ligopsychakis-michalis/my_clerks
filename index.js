// catch elements
const domCards = document.getElementById('cards');
const domColorPicker = document.getElementById('color-picker');
const domLoader = document.getElementById('loader');
const domUpArrow = document.getElementById('scroll-to-top');

// init variables
const clerks = [];
let page = 1;
const storedColor = window.localStorage.getItem('color-picker');
domColorPicker.value = '#ffffff';
if (storedColor) domColorPicker.value = storedColor;

// color picker listener
domColorPicker.addEventListener('input', e => {
    updateClerksColors(e.target.value);
});

// infinite scrolling listener
window.addEventListener('scroll', e => {
    if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight && page <= 10) {
        fetchClerks();
    }

    if (window.scrollY > 130) domUpArrow.style.visibility = 'visible';
    else domUpArrow.style.visibility = 'hidden';
});

// scroll to top listener
domUpArrow.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


async function fetchClerks () {
    const response = await fetch(`https://randomuser.me/api/?page=${page}&results=10`);
    const data = await response.json();

    if (data?.results) {
        clerks.push(data?.results);
        renderNewClerks(data?.results);
        updateClerksColors(domColorPicker.value);
    }

    page++;

    // max users -> 100
    if (page > 10) domLoader.style.display = 'none';

    // recall fetchClerks in case current Clerks doesn't overflow the window's height
    if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight && page <= 10) fetchClerks();
}

function renderNewClerks(newClerks) {
    newClerks.forEach(clerk => {
        const domCard = document.createElement("div");
        domCard.classList.add("card");

        domCard.innerHTML = `
            <img src=${clerk.picture.medium} />
            <ul>
                <li>${clerk.name.title || ''} ${clerk.name.first || ''} ${clerk.name.last || ''}</li>
                <li>${clerk.email || '---'}</li>
                <li>${clerk.phone || '---'}</li>
                <li>${clerk.location.city || ''}, ${clerk.location.country || ''}</li>
            </ul>
        `;

        domCards.appendChild(domCard);
    });
}

function updateClerksColors(hex) {
    const allClerks = document.getElementsByClassName('card');
    let textHex = '#000000';
    if (
        parseInt(hex[1]) < 4 ||
        parseInt(hex[3]) < 4 ||
        parseInt(hex[5]) < 4
    ) {
        textHex = '#ffffff';
    }    

    for (let i = 0; i < allClerks.length; i++) {
        allClerks[i].style.backgroundColor = hex;
        allClerks[i].style.color = textHex;
    }

    window.localStorage.setItem('color-picker', hex);
}

// fetch first 10 clerks
fetchClerks().then(() => {
    if (storedColor) updateClerksColors(storedColor);
});