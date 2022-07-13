// catch elements
const domCards = document.getElementById('cards');
const domColorPicker = document.getElementById('color-picker');
domColorPicker.value = '#ffffff';

// init variables
const clerks = [];
let page = 1;
const storedColor = window.sessionStorage.getItem('color-picker');
if (storedColor) domColorPicker.value = storedColor;

// listeners
domColorPicker.addEventListener('input', e => {
    updateClerksColors(e.target.value);
});

async function fetchClerks () {
    const response = await fetch(`https://randomuser.me/api/?page=${page}&results=10`);
    const data = await response.json();

    if (data?.results) {
        clerks.push(data?.results);
        renderNewClerks(data?.results);
    }

    page++;
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

    window.sessionStorage.setItem('color-picker', hex);
}

fetchClerks().then(() => {
    if (storedColor) updateClerksColors(storedColor);
});