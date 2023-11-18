// scripts.js

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
