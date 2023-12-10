// By Owen Jones and Gavin Cunningham 

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


function showSuccessMessage(message) {
    hideErrorMessage(); // Hide any existing error message
    const successMessage = document.getElementById('successMessage');
    successMessage.innerText = message;
    successMessage.style.display = 'block';
    console.log('Success message displayed:', message); // Add this line
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

