async function loadParks() {
    const response = await fetch('/api/getParks');
    const parks = await response.json();

    const parkList = document.getElementById('park-list');
    parkList.innerHTML = '';

    parks.forEach(park => {
        const listItem = document.createElement('li');
        listItem.textContent = park.name;
        listItem.onclick = () => window.location.href = `park.html?park_id=${park.park_id}`;
        parkList.appendChild(listItem);
    });
}

function goToProfile() {
    window.location.href = 'profile.html';
}

document.addEventListener('DOMContentLoaded', loadParks);