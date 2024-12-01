const url='https://backend-server-ohpm.onrender.com'
function toggleForm() {
    var role = document.getElementById("role").value;
    document.getElementById("student-form").style.display = "none";
    document.getElementById("teacher-form").style.display = "none";
    document.getElementById("staff-form").style.display = "none";

    if (role === "student") {
        document.getElementById("student-form").style.display = "block";
    } else if (role === "teacher") {
        document.getElementById("teacher-form").style.display = "block";
    } else if (role === "staff") {
        document.getElementById("staff-form").style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initially hide all error messages
    document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.style.display = 'none';
    });
    document.querySelectorAll('.signup-form').forEach(form => {
        form.addEventListener('submit',async function (e) {
            e.preventDefault(); // Prevent default form submission
            
            const role = document.getElementById("role").value; // Get the selected role dynamically

            // Roll number uniqueness check for students
            const rollNo = document.getElementById('roll-no')?.value.trim();
            
            if (role === 'student') {                
                // Roll number uniqueness check
                

                
                const contact_number=document.getElementById('contact-number').value;
                console.log(contact_number);
                // Validate contact number (exactly 10 digits)
                if (contact_number.length !== 10 || isNaN(contact_number)) {
                    const contactNumberError = document.getElementById('contact-number-error');
                    contactNumberError.style.display = 'block';
                    contactNumberError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout(contactNumberError); // Hide after 2 seconds
                    return; // Prevent form submission
                }
                
                // If validation passes, handle student data
                const name = document.getElementById('student-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const course = document.getElementById('course').value;
                const batch = document.getElementById('batch').value;
                const password = document.getElementById('password').value;
                const email=document.getElementById('email').value;

                const studentData = { name, gender, course, batch, roll_no: rollNo, email, contact_number, password,user_type:'student'};
                console.log(studentData);
                // Safely parse and update localStorage with new student data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/student/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                });
                console.log(studentData);
                console.log(await response.json());
             }
             
             
             else if (role === 'teacher') {
                // Email uniqueness check
                const email = document.getElementById('teacher-email').value.trim()
                // Contact Number uniqueness check
                const mobile_no = document.getElementById('teacher-contact').value.trim();
                

                // Validate contact number (exactly 10 digits)
                if (mobile_no.length !== 10 || isNaN(mobile_no)) {
                    const teacherContactError = document.getElementById('teacher-contact-error');
                    teacherContactError.style.display = 'block';
                    teacherContactError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout(teacherContactError); // Hide after 2 seconds
                    return; // Prevent form submission
                }
                const name = document.getElementById('teacher-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const department = document.getElementById('department').value;
                const designation = document.getElementById('designation').value;
            
              
                const password = document.getElementById('teacher-password').value;

                const teacherData = { name, gender, department, designation, email, contact_number:mobile_no, user_type:'teacher',password };
                // Safely parse localStorage data
            
                console.log(teacherData);
                // Safely parse and update localStorage with new student data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/faculty/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(teacherData),
                });
                console.log(teacherData);
                console.log(await response.json());

            } 
            
            else if (role === 'staff') {
                
                // Email uniqueness check
                
                const email = document.getElementById('staff-email').value;

                

                // Contact Number uniqueness check
                const mobile_no = document.getElementById('staff-contact').value;
                
                // Validate contact number (exactly 10 digits)
                if (mobile_no.length !== 10 || isNaN(mobile_no)) {
                    const  staffContactError = document.getElementById('staff-contact-error');
                    staffContactError.style.display = 'block';
                    staffContactError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout( staffContactError); // Hide after 2 seconds
                    return; // Prevent form submission
                }

                const name = document.getElementById('staff-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const department = document.getElementById('staff-department').value;
                const designation = document.getElementById('staff-designation').value;
                const password = document.getElementById('staff-password').value;

                const staffData = { name, gender, department, designation, email,contact_number: mobile_no, user_type: 'staff',password };

                
                // Safely parse localStorage data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/faculty/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(staffData),
                });
                console.log(staffData);
                console.log(await response.json());
              
            }

            // Display success message and handle redirection
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block'; // Show success message

            form.reset(); // Reset the form

            // Redirect to the index page after 3 seconds
            setTimeout(function () {
                window.location.href = 'index.html'; // Redirect to index or another page
            }, 3000);
        });
    });
});


// Function to hide the error message after 2 seconds
function hideErrorAfterTimeout(errorElement) {
    setTimeout(() => {
        errorElement.style.display = 'none'; // Hide the error message after 2 seconds
    }, 2000);
}


const emailInputs = {
    student: document.getElementById("email"),
    teacher: document.getElementById("teacher-email"),
    staff: document.getElementById("staff-email")
};

const verifyButtons = {
    student: document.getElementById("student-verifyButton"),
    teacher: document.getElementById("teacher-verifyButton"),
    staff: document.getElementById("staff-verifyButton")
};


const submitButtons = {
    student: document.querySelector("#student-form button[type='submit']"),
    teacher: document.querySelector("#teacher-form button[type='submit']"),
    staff: document.querySelector("#staff-form button[type='submit']")
};


// Regular expression for basic email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;

// Show notification function
function showNotification(notification, notificationMessage, message, color) {
    notificationMessage.textContent = message;
    notificationMessage.style.color = color;
    notification.style.display = "block"; // Show notification

    setTimeout(() => {
        notification.style.display = "none"; // Hide notification after 3 seconds
    }, 3000);
}






