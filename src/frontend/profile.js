async function loadProfile() {
    const userId = sessionStorage.getItem('userId');
    const response = await fetch(`/api/getUserProfile?id=${userId}`);
    const { firstName, lastName, password, age, phone, favoriteDishes, favoriteRides } = await response.json();

    document.getElementById('first-name').value = firstName || '';
    document.getElementById('last-name').value = lastName || '';
    document.getElementById('password').value = password || '';
    document.getElementById('age').value = age || '';
    document.getElementById('phone').value = phone || '';

    populateList('favorite-dishes', favoriteDishes, 'restaurant.html');
    populateList('favorite-rides', favoriteRides, 'ride.html');
}

async function updateProfile(field) {
    const userId = sessionStorage.getItem('userId');
    const value = document.getElementById(field.replace('_', '-')).value;

    const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fieldName: field, newValue: value })
    });

    if (response.ok) {
        alert('Profile updated successfully');
    } else {
        alert('Failed to update profile');
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

document.addEventListener('DOMContentLoaded', loadProfile);