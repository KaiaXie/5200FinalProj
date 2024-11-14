async function loadRestaurantDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');
    const userId = sessionStorage.getItem('userId');

    const response = await fetch(`/api/getRestaurantDetails?id=${restaurantId}&userId=${userId}`);
    const { name, dishes } = await response.json();

    document.getElementById('restaurant-name').textContent = name;
    const dishList = document.getElementById('dish-list');
    dishList.innerHTML = '';

    dishes.forEach(dish => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${dish.name} - $${dish.price} - ${dish.description} 
            <span onclick="toggleFavoriteDish(${dish.id}, event)">${dish.isFavorite ? '❤️' : '♡'}</span>
        `;
        dishList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', loadRestaurantDetails);

async function toggleFavoriteDish(dishId, event) {
    const userId = sessionStorage.getItem('userId'); // 获取当前用户的 ID
    if (!userId) {
        alert("Please log in to favorite this dish.");
        return;
    }

    const heartIcon = event.target;
    const action = heartIcon.textContent === '♡' ? 'add' : 'remove';

    const response = await fetch('/api/toggleFavoriteDish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dishId, action })
    });

    if (response.ok) {
        // 根据操作更新图标的状态
        heartIcon.textContent = action === 'add' ? '❤️' : '♡';
    } else {
        console.error("Failed to toggle favorite dish");
    }
}



document.addEventListener('DOMContentLoaded', loadRestaurantDetails);