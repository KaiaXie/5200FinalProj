async function loadRideDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const rideId = urlParams.get('id');
    const userId = sessionStorage.getItem('userId');

    const response = await fetch(`/api/getRideDetails?id=${rideId}&userId=${userId}`);
    const { name, type, description, isFavorite } = await response.json();

    document.getElementById('ride-name').textContent = name;
    document.getElementById('ride-type').textContent = type;
    document.getElementById('ride-description').textContent = description;

    // Set icons for favorites
    const favoriteIcon = document.getElementById('favorite-icon');
    favoriteIcon.textContent = isFavorite ? '❤️' : '♡';
    favoriteIcon.onclick = (event) => toggleFavoriteRide(rideId, event);
}

async function toggleFavoriteRide(rideId, event) {
    const userId = sessionStorage.getItem('userId'); // Get current use id
    if (!userId) {
        alert("Please log in to favorite this ride.");
        return;
    }

    const heartIcon = event.target;
    const action = heartIcon.textContent === '♡' ? 'add' : 'remove';

    console.log(`Toggling favorite for ride ID: ${rideId}, Action: ${action}`);

    const response = await fetch('/api/toggleFavoriteRide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rideId, action })
    });

    if (response.ok) {
        // update icon status
        heartIcon.textContent = action === 'add' ? '❤️' : '♡';
        console.log(`Successfully toggled favorite for ride ID: ${rideId}`);
    } else {
        console.error("Failed to toggle favorite ride");
    }
}

window.toggleFavoriteRide = toggleFavoriteRide;

document.addEventListener('DOMContentLoaded', loadRideDetails);