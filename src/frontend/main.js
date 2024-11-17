async function signIn() {
    const firstName = document.getElementById('signin-firstname').value;
    const lastName = document.getElementById('signin-lastname').value;
    const password = document.getElementById('signin-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, password })
    });

    const data = await response.json();
    if (data.success) {
        sessionStorage.setItem('userId', data.userId); // Store current user Id
        window.location.href = 'choose_park.html';
    } else {
        alert('Invalid credentials');
    }
}

async function signUp() {
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, password })
    });

    const data = await response.json();
    if (data.success) {
        alert("Signup successful!");
        window.location.href = "/index.html";
    } else {
        alert(data.message || "Signup failed.");
    }
}