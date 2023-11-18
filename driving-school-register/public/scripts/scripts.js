// scripts.js

// Registration form event listener
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
            const responseData = await response.json();

            // Registration successful
            console.log('Registration successful:', responseData.data);
            showSuccessMessage('Registration successful');
        } else {
            const errorData = await response.json();

            // Registration failed, show an error message
            console.error('Registration failed:', errorData.error);
            showErrorMessage(errorData.error);
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
        showErrorMessage('Error during registration. Please try again later.');
    }
});

// Login form event listener
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
            const responseData = await response.json();

            // Login successful
            console.log('Login successful:', responseData.data);
            showSuccessMessage('Login successful');
        } else {
            const errorData = await response.json();

            // Login failed, show an error message
            console.error('Login failed:', errorData.error);
            alert('Login failed. Please check your email and password.');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        alert('Error during login. Please try again later.');
    }
});

// Function to show success message
function showSuccessMessage(message) {
    hideErrorMessage(); // Hide any existing error message
    const successMessage = document.getElementById('successMessage');
    successMessage.innerText = message;
    successMessage.style.display = 'block';
}

// Function to hide success message
function hideSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
}

// Function to show error message
function showErrorMessage(message) {
    hideSuccessMessage(); // Hide any existing success message
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

// Function to hide error message
function hideErrorMessage() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Function to switch to the registration form
function showRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'grid';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Registration';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'none';
}

// Function to switch to the login form
function showLoginForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Driving School Login';
    document.getElementById('switchToLoginFormButton').style.display = 'none';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
}

// Initially show the registration form
showRegistrationForm();
