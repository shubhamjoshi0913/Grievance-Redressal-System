
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


document.getElementById('index-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    const loginData = {
        email: email,
        password: password,
        userType:userType
    };

    // Log the form data for debugging
    console.log('Login Data:', loginData);
    prodUrl='https://backend-server-ohpm.onrender.com/api/v1/user/login/'
    devUrl='http://127.0.0.1:8000/api/v1/user/login/'
    // Make an API call to the FastAPI login endpoint
    fetch(prodUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {

            // Notify the user of successful login
            console.log(data.user_data);
            localStorage.setItem('user_id', JSON.stringify(data.user_data.user_id));
            localStorage.setItem('user_name', JSON.stringify(data.user_data.name));
            localStorage.setItem('user_type', JSON.stringify(data.user_data.user_type));
            // You can redirect the user to another page (dashboard, etc.)
            if(userType=='admin' || userType=='Grievance Member'){
                window.location.href='/admin.html';
            }
            else{
            window.location.href = '/login.html';
            }
        } else {
            // Notify the user of login failure
            alert('Login failed: ' + data.detail);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    });
});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});


// Function to display form fields based on user type selection
function showFormFields() {
    const userType = document.getElementById('user-type').value;

    // Hide all specific fields initially
    document.getElementById('student-fields').style.display = 'none';
    document.getElementById('teacher-fields').style.display = 'none';
    document.getElementById('non-teaching-fields').style.display = 'none';

    // Show specific fields based on the selected user type
    if (userType === 'Student') {
        document.getElementById('student-fields').style.display = 'block';
    } else if (userType === 'Teacher') {
        document.getElementById('teacher-fields').style.display = 'block';
    } else if (userType === 'Non-Teaching-Staff') {
        document.getElementById('non-teaching-fields').style.display = 'block';
    }
}


// Function to handle login form submission

    

// Adding event listener for login form submission when the DOM is fully loaded