
function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function signOut() {
    window.location.href = 'index.html'; // Redirect to login page
}


async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contact-number').value;
    const userType = document.getElementById('user-type').value; // Capture user type
    const userId = JSON.parse(localStorage.getItem('user_id'));
     // Get user_id from localStorage
    console.log(userId);
    try {
        // Send API request to update profile
        const response = await fetch('https://backend-server-ohpm.onrender.com/api/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                name: name,
                email: email,
                contact_number: contactNumber,
                user_type: userType,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            // Show success message

            // Hide the success message after 3 seconds
            setTimeout(() => {
                alert('Profile Updated Successfully');
            }, 3000);

        } else {
            // Handle errors from the server
            alert(data.message || 'Failed to update profile. Please try again.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile. Please try again later.');
    }
}

// Function to show the custom alert box in the center
function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    // Set the alert message
    alertMessage.textContent = message;

    // Display the alert box
    alertBox.style.display = 'block';

    // Hide the alert box after 2 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}

// Helper function to determine the storage key based on user type
function getStorageKey(userType) {
    switch (userType) {
        case 'student':
            return 'approvedStudents';
        case 'teacher':
            return 'approvedTeachers';
        case 'staff':
            return 'approvedStaff';
        default:
            return null;
    }
} 





// const nam =document.getElementById('Name');
document.getElementById('post-grievance-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form dtt grievantType = document.getElementById('grievant-type').value;
    const name = document.getElementById('grievant-name').value;
    const title = document.getElementById('grievance-title').value;
    const description = document.getElementById('grievance-description').value;
    const user_ref=localStorage.getItem('user_id');
    const type=document.getElementById('grievant-type').value;


    // Create a unique grievance number and current date (dd-mm-yyyy format)
    
    const date = new Date().toLocaleDateString('en-GB'); // Get current date in dd-mm-yyyy format

    // Create a grievance object with all data
    const grievanceData = { type, name, title, description, date,user_ref };
    console.log(grievanceData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/user/add_grievance/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(grievanceData)
                });
   if(!response.ok){
    console.log(await response.json());
   }
   else{
    console.log(await response.json());
    this.reset();

    // Optionally, hide the success message after a few seconds
    setTimeout(function() {
        document.getElementById('post-grievance-success').style.display = 'none';
    }, 3000); // Hide after 3 seconds

    // Refresh the grievances table to show the new grievance
    displayGrievances();
   }
    
});

// Function to display grievances
async function displayGrievances() {
    const tbody = document.querySelector('#my-grievance-table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    const user_ref=localStorage.getItem('user_id');
    // Retrieve grievances from local storage
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/user/get_grievances/${user_ref}`);
        if (!response.ok) throw new Error('Failed to fetch grievances');

    const responseJson = await response.json();
    const grievances=responseJson.data;
    console.log(grievances);
    localStorage.setItem("grievances",JSON.stringify(grievances));
    // Check if there are no grievances
    

    // Iterate over each grievance and insert it into the table
    grievances.forEach((grievance, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${grievance.ack_number}</td>
            <td>${grievance.title}</td>
            <td>${grievance.description}</td>
            <td>${grievance.responded?'Replied':'Not Replied'}</td>
            <td><button class="view-button" style="color: white; background-color: #1abc9c; padding: 5px; border: none; border-radius: 4px; cursor: pointer;" data-index="${index}">View</button></td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to the View buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const grievances = JSON.parse(localStorage.getItem('grievances') || '[]');
            const grievance = grievances[index];
            console.log(grievance)
            showGrievanceModal(grievance);
        });
    });
}

function showGrievanceModal(grievance) {
    console.log(grievance);
    document.getElementById('modal-grievant-id').innerText = grievance.ack_number;
    document.getElementById('modal-grievant-name').innerText = grievance.name || 'N/A';
    document.getElementById('modal-title').innerText = grievance.title;
    document.getElementById('modal-description').innerText = grievance.description;
    document.getElementById('modal-date').innerText = grievance.date || 'N/A';
    document.getElementById('modal-status').innerText = grievance.responded?'Replied':'Not Replied';

    // Display all replies in chronological order
    const allReplies = grievance.reply||'N/A';
    let contentHtml = '';
    contentHtml += `${grievance.date}<br>${allReplies}<br><br>`;
    

    // If there are no replies yet
    

    document.getElementById('modal-reply').innerHTML = contentHtml;

    // Show modal and overlay
    document.getElementById('grievance-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';

    // Add event listeners to action buttons
    document.getElementById('reopen-button').onclick = function() {
        document.getElementById('feedback-row').style.display = 'table-row';
    };

    document.getElementById('satisfied-button').onclick = function() {
        updateGrievanceStatus(grievance.ack_number, 'Satisfied');
    };

    // Handle feedback submission
    document.getElementById('submit-feedback-button').onclick = function() {
        const feedback = document.getElementById('feedback-text').value;
        if (feedback.trim() !== '') {
            addFeedbackToGrievance(grievance.grievantID, feedback, "User Reply");
        } else {
            alert("Please enter feedback before submitting.");
        }
    };
}

function addFeedbackToGrievance(grievantID, feedback, userType) {
    const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
    const grievanceIndex = storedGrievances.findIndex(grievance => grievance.grievantID === grievantID);

    if (grievanceIndex !== -1) {
        const date = new Date().toLocaleDateString();
        const formattedReply = {
            user: userType,
            date: date,
            message: feedback
        };

        // Append reply to the list of replies
        if (!storedGrievances[grievanceIndex].replies) {
            storedGrievances[grievanceIndex].replies = [];
        }
        storedGrievances[grievanceIndex].replies.push(formattedReply);

        // Update grievance status to 'Re-Open'
        storedGrievances[grievanceIndex].status = 'Re-Open';
        localStorage.setItem('grievances', JSON.stringify(storedGrievances));

        // Update status in modal and refresh replies
        document.getElementById('modal-status').innerText = 'Re-Open';
        showGrievanceModal(storedGrievances[grievanceIndex]);

        // Hide feedback row and clear feedback input
        document.getElementById('feedback-row').style.display = 'none';
        document.getElementById('feedback-text').value = '';

        // Refresh grievances display
        displayGrievances();
    }
}

// Function to update grievance status in localStorage
function updateGrievanceStatus(grievantID, newStatus) {
    const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
    const grievanceIndex = storedGrievances.findIndex(grievance => grievance.grievantID === grievantID);

    if (grievanceIndex !== -1) {
        // Update grievance status to 'Satisfied'
        storedGrievances[grievanceIndex].status = newStatus;
        localStorage.setItem('grievances', JSON.stringify(storedGrievances));

        // Update modal status text and close modal
        document.getElementById('modal-status').innerText = newStatus;
        document.getElementById('grievance-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';

        // Refresh grievances display
        displayGrievances();
    }
}

// Close modal when clicking the close button
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('grievance-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
});

// Call the function to display the data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayGrievances();
});





async function handlePasswordChange(event) {
    event.preventDefault();

    // Retrieve input values
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const loggedInEmail =JSON.parse(localStorage.getItem('user_id'));  // Assuming logged-in email is stored in localStorage
    
    const user_type=localStorage.getItem('user_type');
    console.log(user_type)
    // Validate inputs
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
        return; // Exit if validation fails
    }

    try {
        // API request to change the password
        const response = await fetch('https://backend-server-ohpm.onrender.com/api/change-user-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: loggedInEmail,
                password: currentPassword,
                user_type: user_type,
            }),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            // Show success message
            showNotification("Password changed successfully!");
            document.getElementById("change-password-success").style.display = "block";

            // Reset the form
            resetPasswordForm();
        } else {
            // Handle errors from the server
            const errorMessage = data;
            console.log(data);
            showNotification(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while changing the password. Please try again later.');
    }
}

/**
 * Validate the password change inputs.
 * @param {string} currentPassword - The current password.
 * @param {string} newPassword - The new password.
 * @param {string} confirmPassword - The confirmation of the new password.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification("All fields are required!");
        return false;
    }

    if (newPassword !== confirmPassword) {
        showNotification("New password and confirm password do not match!");
        return false;
    }

    if (newPassword.length < 8) {
        showNotification("New password must be at least 8 characters long!");
        return false;
    }

    return true;
}

/**
 * Display a notification message.
 * @param {string} message - The message to display.
 */
function showNotification(message) {
    alert(message); // Replace this with a custom notification mechanism if desired
}

/**
 * Reset the password form inputs.
 */
function resetPasswordForm() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

document.addEventListener('DOMContentLoaded', () => {

    const loggedInEmail = localStorage.getItem('email');
if (loggedInEmail) {
    // Extract the username from the email
    const userName = loggedInEmail.split('@')[0].match(/^[a-zA-Z]+/)[0]; // Gets the part before '@'
    document.getElementById('Name').textContent =  `Welcome ${userName}!!`;
} else {
    document.getElementById('Name').textContent = "Welcome";
}
    
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const inputId = toggle.getAttribute('data-input');
        const inputElement = document.getElementById(inputId);
        
        // Toggle between password and text input types
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            toggle.classList.remove('fa-eye');
            toggle.classList.add('fa-eye-slash');
        } else {
            inputElement.type = 'password';
            toggle.classList.remove('fa-eye-slash');
            toggle.classList.add('fa-eye');
        }
    });
});
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to show notification
    window.showNotification = function(message) {
        const notification = document.getElementById("notification");
        const notificationMessage = document.getElementById("notificationMessage");
        notificationMessage.textContent = message; // Set the message
        notification.style.display = "block"; // Show the notification
    };

    // Add event listener to OK button to hide the notification and clear the form
    document.getElementById("notificationOkButton").onclick = function() {
        // Hide the notification
        document.getElementById("notification").style.display = "none";
        
        // Clear the form fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    };
});



