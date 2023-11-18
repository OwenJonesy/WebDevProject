document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            console.log('Registration successful');
        } else {
            console.error('Registration failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            console.log('Login successful');
            showSuccessMessage(); // Display success message
        } else {
            console.error('Login failed:', response.statusText);
            alert('Login failed. Please check your email and password.');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        alert('Error during login. Please try again later.');
    }
});

// Toggle between registration and login forms
function showRegistrationForm() {
    document.getElementById('pageTitle').innerText = 'Driving School Registration';
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    hideSuccessMessage(); // Hide success message when switching forms
}

function showLoginForm() {
    document.getElementById('pageTitle').innerText = 'Driving School Login';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    hideSuccessMessage(); // Hide success message when switching forms
}

// Display success message
function showSuccessMessage() {
    document.getElementById('successMessage').style.display = 'block';
}

// Hide success message
function hideSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
}

// Initially show the registration form
showRegistrationForm();
