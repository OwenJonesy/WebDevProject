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

// Event listener for the "Change Password" button
document.getElementById('changePasswordButton').addEventListener('click', function () {
    hideChangePasswordButton(); // Hide the "Change Password" button when showing the password update form
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('updatePasswordForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Change Password';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
});

// Add an event listener for the password update form
document.getElementById('updatePasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formDataObject.emailForPasswordUpdate,
                oldPassword: formDataObject.oldPassword,
                newPassword: formDataObject.newPassword,
            }),
        });

        if (response.ok) {
            // Password update successful
            const responseData = await response.json();
            console.log('Password update successful:', responseData.message);
            showSuccessMessage('Password update successful');
        } else {
            // Password update failed, show an error message
            const errorData = await response.json();
            console.error('Password update failed:', errorData.error);
            showErrorMessage(errorData.error);
        }
    } catch (error) {
        console.error('Error during password update:', error.message);
        showErrorMessage('Error during password update. Please try again later.');
    }
});

// Function to hide the "Change Password" button
function hideChangePasswordButton() {
    const changePasswordButton = document.getElementById('changePasswordButton');
    if (changePasswordButton) {
        changePasswordButton.style.display = 'none';
    }
}

// Function to show the "Change Password" button
function showChangePasswordButton() {
    const changePasswordButton = document.getElementById('changePasswordButton');
    if (changePasswordButton) {
        changePasswordButton.style.display = 'block';
    }
}

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
    document.getElementById('updatePasswordForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Registration';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'none';
    showChangePasswordButton(); // Show the "Change Password" button when switching to registration form
}

// Function to switch to the login form
function showLoginForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'grid';
    document.getElementById('updatePasswordForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Login';
    document.getElementById('switchToLoginFormButton').style.display = 'none';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
    showChangePasswordButton(); // Show the "Change Password" button when switching to login form
}

// Function to show the password update form
function showPasswordUpdateForm() {
    hideChangePasswordButton(); // Hide the "Change Password" button when showing the password update form
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('updatePasswordForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Change Password';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
}

// Initially show the registration form
showRegistrationForm();
