async function loadParkDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const parkId = urlParams.get('park_id');

    try {
        const response = await fetch(`http://localhost:3000/api/getParkDetails?park_id=${parkId}`);
        if (!response.ok) throw new Error("Failed to fetch park details");

        const data = await response.json();
        const { park, restaurants, rides, stores, events } = data;

        // Ensure there is park data
        if (!park) throw new Error("Park data not found");

        // Set park title
        document.getElementById('park-title').textContent = `${park.name} - ${park.company} - ${park.city}`;

        // print each list
        populateList('restaurant-list', restaurants, 'restaurant.html');
        populateList('ride-list', rides, 'ride.html');
        populateList('store-list', stores, 'store.html');
        populateList('event-list', events, 'event.html');
    } catch (error) {
        console.error("Error loading park details:", error);
        alert("Could not load park details.");
    }
}

function populateList(listId, items, page) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item.name;
        listItem.onclick = () => window.location.href = `${page}?id=${item.id}`;
        list.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', loadParkDetails);