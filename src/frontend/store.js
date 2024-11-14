async function loadStoreDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('id');

    const response = await fetch(`/api/getStoreDetails?id=${storeId}`);
    const { name, theme, souvenirs } = await response.json();

    document.getElementById('store-name').textContent = name;
    document.getElementById('store-theme').textContent = theme;

    const souvenirList = document.getElementById('souvenir-list');
    souvenirList.innerHTML = '';
    souvenirs.forEach(souvenir => {
        const listItem = document.createElement('li');
        listItem.textContent = `${souvenir.name} - $${souvenir.price}`;
        souvenirList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', loadStoreDetails);