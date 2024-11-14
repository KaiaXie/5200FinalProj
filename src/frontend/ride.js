async function loadRideDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const rideId = urlParams.get('id');
    const userId = sessionStorage.getItem('userId');

    const response = await fetch(`/api/getRideDetails?id=${rideId}&userId=${userId}`);
    const { name, type, description, isFavorite } = await response.json();

    document.getElementById('ride-name').textContent = name;
    document.getElementById('ride-type').textContent = type;
    document.getElementById('ride-description').textContent = description;

    // 设置收藏图标状态
    const favoriteIcon = document.getElementById('favorite-icon');
    favoriteIcon.textContent = isFavorite ? '❤️' : '♡';
    favoriteIcon.onclick = (event) => toggleFavoriteRide(rideId, event); // 绑定事件
}

async function toggleFavoriteRide(rideId, event) {
    const userId = sessionStorage.getItem('userId'); // 获取当前用户 ID
    if (!userId) {
        alert("Please log in to favorite this ride.");
        return;
    }

    const heartIcon = event.target;
    const action = heartIcon.textContent === '♡' ? 'add' : 'remove';

    console.log(`Toggling favorite for ride ID: ${rideId}, Action: ${action}`); // 日志输出调试

    const response = await fetch('/api/toggleFavoriteRide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rideId, action })
    });

    if (response.ok) {
        // 根据操作更新图标状态
        heartIcon.textContent = action === 'add' ? '❤️' : '♡';
        console.log(`Successfully toggled favorite for ride ID: ${rideId}`); // 成功操作日志
    } else {
        console.error("Failed to toggle favorite ride");
    }
}

// 将函数暴露到全局
window.toggleFavoriteRide = toggleFavoriteRide;

document.addEventListener('DOMContentLoaded', loadRideDetails);