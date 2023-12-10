//---- By Owen Jones and Gavin Cunningham 

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
			
			document.getElementById('switchToChangePasswordFormButton').style.display = 'inline-block';
			document.getElementById('switchToDeleteAccountFormButton').style.display = 'inline-block';

            // Fetch user details and bookings
            const userDetailsResponse = await fetch(`/user-details/${formDataObject.loginEmail}`);
            if (userDetailsResponse.ok) {
                const userDetailsData = await userDetailsResponse.json();

                // Include bookings in user data
                responseData.data.bookings = userDetailsData.data.bookings;
            }

            showSuccessMessage('Login successful');
            // Show user details
            showUserDetails(responseData.data);

        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData.error);
            alert('Login failed. Please check your email and password.');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        alert('Error during login. Please try again later.');
    }
});


function showUserDetails(userData) {
    console.log('User Data:', userData); // Log the user data
    // Hide the login form
    hideForms(); // Hide all forms
    hideSuccessMessage(); // Hide success message
    hideErrorMessage(); // Hide error message

    // Create an element to display user details
    const userDetailsElement = document.createElement('div');
    userDetailsElement.innerHTML = `
        <h2>User Details:</h2>
        <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phoneNumber}</p>
    `;

    // Check if bookings are available
    if (userData.bookings && userData.bookings.length > 0) {
        const bookingsElement = document.createElement('div');
        bookingsElement.innerHTML = `
            <h2>Bookings:</h2>
        `;

        // Display booking details
        userData.bookings.forEach((booking, index) => {
            bookingsElement.innerHTML += `
                <p><strong>Booking ${index + 1}:</strong></p>
                <p><strong>Instructor:</strong> ${booking.instructor}</p>
                <p><strong>Course Type:</strong> ${booking.coursetype}</p>
                <p><strong>Preferred Time:</strong> ${formatPreferredTime(booking.preferredTime)}</p>
            `;
        });

        // Append booking details to the user details element
        userDetailsElement.appendChild(bookingsElement);
    }

    // Append the user details element to the body
    document.body.appendChild(userDetailsElement);
}


// Function to format the preferred time
function formatPreferredTime(preferredTime) {
    const date = new Date(preferredTime);
    const formattedDate = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    return formattedDate;
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

// Delete account form event listener
document.getElementById('deleteAccountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Account deletion successful:', responseData.message);
            showSuccessMessage('Account deletion successful');

        } else {
            const errorData = await response.json();
            console.error('Account deletion failed:', errorData.error);
            showErrorMessage(`Account deletion failed: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error during account deletion:', error.message);
        showErrorMessage('Error during account deletion. Please try again later.');
    }
});

// Function to switch to the delete account form
function showDeleteAccountForm() {
    hideForms(); // Hide all forms
    hideSuccessMessage(); // Hide success message
    hideErrorMessage(); // Hide error message

    document.getElementById('deleteAccountForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Delete Account';

    // Show switch buttons except for the delete account form button
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToChangePasswordFormButton').style.display = 'inline-block';
    document.getElementById('switchToDeleteAccountFormButton').style.display = 'none';
}

// Event listener for the delete account form switching button
document.getElementById('switchToDeleteAccountFormButton').addEventListener('click', showDeleteAccountForm);

// Event listeners for form switching buttons
document.getElementById('switchToLoginFormButton').addEventListener('click', showLoginForm);
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


// Function to switch to the login form
function showLoginForm() {
    hideForms(); // Hide all forms
    hideSuccessMessage(); // Hide success message
    hideErrorMessage(); // Hide error message

    document.getElementById('loginForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Driving School Login';

    // Show switch buttons except for the login form button
    document.getElementById('switchToLoginFormButton').style.display = 'none';
    document.getElementById('switchToChangePasswordFormButton').style.display = 'inline-block';
    document.getElementById('switchToDeleteAccountFormButton').style.display = 'inline-block';
}

// Function to switch to the change password form
function showChangePasswordForm() {
    hideForms(); // Hide all forms
    hideSuccessMessage(); // Hide success message
    hideErrorMessage(); // Hide error message

    document.getElementById('changePasswordForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Change Password';

    // Show switch buttons except for the change password form button
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';

    document.getElementById('switchToChangePasswordFormButton').style.display = 'none';
    document.getElementById('switchToDeleteAccountFormButton').style.display = 'inline-block';
}

// Function to hide all forms
function hideForms() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('deleteAccountForm').style.display = 'none';
}

function clearUserDetails() {
    // Code to clear or hide user details
    // For example, if user details are in a div with id 'userDetails'
    document.getElementById('userDetails').innerHTML = '';
    // Add any other necessary code to reset the state of the page
}

// Initially show the registration form
showLoginForm();
