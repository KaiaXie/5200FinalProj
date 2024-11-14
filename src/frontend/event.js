async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    const response = await fetch(`/api/getEventDetails?id=${eventId}`);
    const { name, description, startDate, endDate } = await response.json();

    document.getElementById('event-name').textContent = name;
    document.getElementById('event-description').textContent = description;
    document.getElementById('event-start-date').textContent = startDate;
    document.getElementById('event-end-date').textContent = endDate;
}

document.addEventListener('DOMContentLoaded', loadEventDetails);