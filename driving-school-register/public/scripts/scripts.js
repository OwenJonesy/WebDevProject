document.getElementById('changePasswordButton').addEventListener('click', function () {
    hideChangePasswordButton();
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('deleteAccountForm').style.display = 'none';
    document.getElementById('updatePasswordForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Change Password';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
});

document.getElementById('deleteAccountButton').addEventListener('click', function () {
    hideDeleteAccountForm();
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('updatePasswordForm').style.display = 'none';
    document.getElementById('deleteAccountForm').style.display = 'grid';
    document.getElementById('pageTitle').innerText = 'Delete Account';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
});

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
            const responseData = await response.json();
            console.log('Password update successful:', responseData.message);
            showSuccessMessage('Password update successful');
        } else {
            const errorData = await response.json();
            console.error('Password update failed:', errorData.error);
            showErrorMessage(errorData.error);
        }
    } catch (error) {
        console.error('Error during password update:', error.message);
        showErrorMessage('Error during password update. Please try again later.');
    }
});

document.getElementById('deleteAccountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch('/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formDataObject.loginEmailForDelete,
                password: formDataObject.loginPasswordForDelete,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Account deletion successful:', responseData.message);
            showSuccessMessage('Account deletion successful');
        } else {
            const errorData = await response.json();
            console.error('Account deletion failed:', errorData.error);
            showErrorMessage(errorData.error);
        }
    } catch (error) {
        console.error('Error during account deletion:', error.message);
        showErrorMessage('Error during account deletion. Please try again later.');
    }
});

function hideChangePasswordButton() {
    const changePasswordButton = document.getElementById('changePasswordButton');
    if (changePasswordButton) {
        changePasswordButton.style.display = 'none';
    }
}

function hideDeleteAccountForm() {
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    if (deleteAccountButton) {
        deleteAccountButton.style.display = 'none';
    }
}

function showSuccessMessage(message) {
    hideErrorMessage();
    const successMessage = document.getElementById('successMessage');
    successMessage.innerText = message;
    successMessage.style.display = 'block';
}

function hideSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
}

function showErrorMessage(message) {
    hideSuccessMessage();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function hideErrorMessage() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'grid';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('updatePasswordForm').style.display = 'none';
    document.getElementById('deleteAccountForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Registration';
    document.getElementById('switchToLoginFormButton').style.display = 'inline-block';
    document.getElementById('switchToRegisterFormButton').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'grid';
    document.getElementById('updatePasswordForm').style.display = 'none';
    document.getElementById('deleteAccountForm').style.display = 'none';
    document.getElementById('pageTitle').innerText = 'Driving School Login';
    document.getElementById('switchToLoginFormButton').style.display = 'none';
    document.getElementById('switchToRegisterFormButton').style.display = 'inline-block';
}

showRegistrationForm();
