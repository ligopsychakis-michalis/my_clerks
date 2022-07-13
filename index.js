// catch elements
const domCards = document.getElementById('cards');

// init variables
const clerks = [];
let page = 1;

async function fetchClerks () {
    const response = await fetch(`https://randomuser.me/api/?page=${page}&results=20`);
    const data = await response.json();

    if (data?.results) {
        clerks.push(data?.results);
        renderNewClerks(data?.results);
    }

    page++;
}

function renderNewClerks(newClerks) {
    newClerks.forEach(clerk => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src=${clerk.picture.medium} />
            <ul>
                <li>${clerk.name.title || ''} ${clerk.name.first || ''} ${clerk.name.last || ''}</li>
                <li>${clerk.email || '---'}</li>
                <li>${clerk.phone || '---'}</li>
                <li>${clerk.location.city || ''}, ${clerk.location.country || ''}</li>
            </ul>
        `;

        domCards.appendChild(card);
    });

}

fetchClerks();