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
            console.log('Registration successful:', responseData.data);
            showSuccessMessage('Registration successful');
            showLoginForm(); // Switch to login form after registration
        } else {
            const errorData = await response.json();
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
            console.log('Login successful:', responseData.data);

            // Show user details
            showUserDetails(responseData.data);

        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData.error);
            showErrorMessage('loginErrorMessage', errorData.error);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        showErrorMessage('loginErrorMessage', 'Error during login. Please try again later.');
    }
});

// Function to show user details
function showUserDetails(userData) {
    // Hide the login form
    document.getElementById('loginForm').style.display = 'none';

    // Create an element to display user details
    const userDetailsElement = document.createElement('div');
    userDetailsElement.innerHTML = `
        <h2>User Details:</h2>
        <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone Number:</strong> ${userData.phoneNumber}</p>
    `;

    // Append the user details element to the body
    document.body.appendChild(userDetailsElement);
}

// Change password form event listener
document.getElementById('changePasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Password change successful:', responseData.message);
            showSuccessMessage('Password change successful');
            showLoginForm(); // Switch to login form after password change
        } else {
            const errorData = await response.json();
            console.error('Password change failed:', errorData.error);
            showErrorMessage(`Password change failed: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error during password change:', error.message);
        showErrorMessage('Error during password change. Please try again later.');
    }
});

// Event listeners for form switching buttons
document.getElementById('switchToLoginFormButton').addEventListener('click', showLoginForm);
document.getElementById('switchToRegisterFormButton').addEventListener('click', showRegistrationForm);
document.getElementById('switchToChangePasswordFormButton').addEventListener('click', showChangePasswordForm);

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
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Registration';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'none';
    document.getElementById('switchToChangePasswordFormButton').style.display = 'inline-block';
}

// Function to switch to the login form
function showLoginForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'grid';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Login';
    document.getElementById('switchToLoginFormButton').style.display = 'none';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
    document.getElementById('switchToChangePasswordFormButton').style.display = 'inline-block';
}

// Function to switch to the change password form
function showChangePasswordForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Change Password';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
    document.getElementById('switchToChangePasswordFormButton').style.display = 'none';
}

// Initially show the registration form
showRegistrationForm();
