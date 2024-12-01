window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    document.querySelector('.container').classList.add('visible');
    document.querySelector('.institute-image').classList.add('loaded');
});

function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the form field values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create an object with the form data
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
    };

    // Retrieve existing messages from localStorage or initialize an empty array
    let storedMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    // Add the new message to the stored messages array
    storedMessages.push(formData);

    // Save the updated array back to localStorage
    localStorage.setItem("contactMessages", JSON.stringify(storedMessages));

    // Show the success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    // Optionally clear the form fields
    document.getElementById('contactForm').reset();

    // Hide the success message after a few seconds (optional)
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);

    return false; // Return false to prevent any further default action
}

// Get the form element
const form = document.getElementById("contactForm");

// Add a single event listener for the form submission
form.addEventListener("submit", handleSubmit);
