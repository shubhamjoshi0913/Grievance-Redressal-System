// Approved users data setup (example)
const approvedUsers = {
    student: JSON.parse(localStorage.getItem('approvedStudents')) || [],
    teacher: JSON.parse(localStorage.getItem('approvedTeachers')) || [],
    staff: JSON.parse(localStorage.getItem('approvedStaff')) || []
};

// Combine all approved users into a single array
const allApprovedUsers = [...approvedUsers.student, ...approvedUsers.teacher, ...approvedUsers.staff];
const members = JSON.parse(localStorage.getItem('members')) || [];


const step1 = document.querySelector(".step1"),
      step2 = document.querySelector(".step2"),
      step3 = document.querySelector(".step3"),
      step4 = document.querySelector(".step4"), // New password step
      emailAddress = document.getElementById("emailAddress"),
      verifyEmail = document.getElementById("verifyEmail"),
      inputs = document.querySelectorAll(".otp-group input"),
      nextButton = document.querySelector(".nextButton"),
      verifyButton = document.querySelector(".verifyButton"),
      newPasswordInput = document.getElementById("newPassword"), // New password input
      confirmPasswordInput = document.getElementById("confirmNewPassword"), // Confirm password input
      setPasswordButton = document.querySelector(".setPasswordButton"); // Button to set new password

const OTP = "1234"; // Hardcoded OTP

window.addEventListener("load", () => {
    step2.style.display = "none";
    step3.style.display = "none";
    step4.style.display = "none"; // Hide new password step initially
    nextButton.classList.add("disable");
    verifyButton.classList.add("disable");
});

const validateEmail = (email) => {
    let re = /^[^\s@]+@[^\s@]+\.com$/;
    if (re.test(email)) {
        nextButton.classList.remove("disable");
    } else {
        nextButton.classList.add("disable");
    }
};


// Check if email exists in the approved list
function isEmailApproved(email) {
    return allApprovedUsers.some(user => user.email === email);
}

// Check if the email matches the admin email
function isAdminEmail(email) {
    const adminEmail = localStorage.getItem('adminEmail'); // Get admin email from localStorage
    return email === adminEmail; // Return true if the email matches the admin email
}


// Check if email exists in the grievance members list
function isGrievanceEmail(email) {
    return members.find(m => m.email === email);
}

// Next button event to check email and show OTP entry section if approved
nextButton.addEventListener("click", () => {
    const email = emailAddress.value.trim();

   // Check if email is approved or is the admin email
   if (isEmailApproved(email)) {
    step1.style.display = "none"; // Hide step 1
    step2.style.display = "block"; // Show step 2 for OTP entry
} else if (isAdminEmail(email)) {
    step1.style.display = "none"; // Hide step 1
    step2.style.display = "block"; // Show step 2 for OTP entry
} else if (isGrievanceEmail(email)) {
    step1.style.display = "none"; // Hide step 1
    step2.style.display = "block"; // Show step 2 for OTP entry
} else {
    showNotification("Invalid email. Please enter a valid email.");
}

});


// Set up OTP input functionality
inputs.forEach((input, index) => {
    input.addEventListener("keyup", function (e) {
        if (this.value.length >= 1) {
            this.value = this.value.substr(0, 1);
        }

        // Move to the next input field if it exists
        if (this.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        // Check if all inputs are filled
        if (Array.from(inputs).every((input) => input.value !== "")) {
            verifyButton.classList.remove("disable");
        } else {
            verifyButton.classList.add("disable");
        }
    });

    // Move to the previous input if the user presses Backspace
    input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && this.value === "" && index > 0) {
            inputs[index - 1].focus();
        }
    });
});


// Verify OTP
verifyButton.addEventListener("click", () => {
    let values = "";
    inputs.forEach((input) => {
        values += input.value;
    });

    if (values === OTP) {
        step1.style.display = "none"; // Hide step 1
        step2.style.display = "none"; // Hide step 2
        step3.style.display = "none"; // Hide any previous steps
        step4.style.display = "block"; // Show new password step
    } else {
        showNotification("Invalid OTP. Please try again.");
        verifyButton.classList.add("error-shake");
    }
});

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");
    notificationMessage.textContent = message; // Set the message
    notification.style.display = "block"; // Show the notification
}

// Function to close the notification
function closeNotification() {
    document.getElementById("notification").style.display = "none"; // Hide the notification
}


// New password logic


// Requirement elements
const lengthRequirement = document.getElementById("length");
const uppercaseRequirement = document.getElementById("uppercase");
const numberRequirement = document.getElementById("number");
const specialCharRequirement = document.getElementById("specialChar");

// Regular expressions for each requirement
const lengthRegex = /.{8,}/;
const uppercaseRegex = /[A-Z]/;
const numberRegex = /\d/;
const specialCharRegex = /[@$!%*?&]/;

newPasswordInput.addEventListener("input", () => {
    const password = newPasswordInput.value;

    // Check each requirement and toggle the "met" class
    lengthRequirement.classList.toggle("met", lengthRegex.test(password));
    uppercaseRequirement.classList.toggle("met", uppercaseRegex.test(password));
    numberRequirement.classList.toggle("met", numberRegex.test(password));
    specialCharRequirement.classList.toggle("met", specialCharRegex.test(password));


    // Show or hide checkmarks based on requirements
    lengthRequirement.querySelector(".checkmark").style.display = lengthRegex.test(password) ? 'inline' : 'none';
    uppercaseRequirement.querySelector(".checkmark").style.display = uppercaseRegex.test(password) ? 'inline' : 'none';
    numberRequirement.querySelector(".checkmark").style.display = numberRegex.test(password) ? 'inline' : 'none';
    specialCharRequirement.querySelector(".checkmark").style.display = specialCharRegex.test(password) ? 'inline' : 'none';
});
// Assuming approvedUsers is defined as you provided
function changePassword(email, newPassword) {
    // Check if the email belongs to admin
    if (isAdminEmail(email)) {
        localStorage.setItem('adminPassword', newPassword);  // Save new admin password
        return true;
    }

    // Check if the email belongs to a grievance member
    if (isGrievanceEmail(email)) {
        const memberIndex = members.findIndex(m => m.email === email);
        if (memberIndex !== -1) {
            members[memberIndex].password = newPassword; // Update member's password
            localStorage.setItem('members', JSON.stringify(members));  // Save updated members list
           return true;
        }
    }

    // Check if email belongs to an approved user (student, teacher, staff)
    for (const userType in approvedUsers) {
        const userIndex = approvedUsers[userType].findIndex(user => user.email === email);
        if (userIndex !== -1) {
            approvedUsers[userType][userIndex].password = newPassword; // Update user's password
            // Save updated approved users back to localStorage
            localStorage.setItem('approvedStudents', JSON.stringify(approvedUsers.student));
            localStorage.setItem('approvedTeachers', JSON.stringify(approvedUsers.teacher));
            localStorage.setItem('approvedStaff', JSON.stringify(approvedUsers.staff));
            return true;
        }
    }

    return false; // If user not found
}




// Final password submission with all conditions validated
setPasswordButton.addEventListener("click", () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const email = emailAddress.value.trim(); // Get the email from the first step

    // Validate all requirements
    if (!lengthRegex.test(newPassword) ||
        !uppercaseRegex.test(newPassword) ||
        !numberRegex.test(newPassword) ||
        !specialCharRegex.test(newPassword)) {
        showNotification("Password does not meet all the requirements.");
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification("Passwords do not match.");
        return;
    }

    // Change the password for the user
    if (changePassword(email, newPassword)) {
        // Hide the password step after setting it
        step4.style.display = "none";
        step3.style.display = "block"; // Show welcome step or another step
        return;
    } 
});


function changeMyEmail() {
    step1.style.display = "block"; // Show step 1
    step2.style.display = "none"; // Hide step 2
    step3.style.display = "none"; // Hide welcome step
    step4.style.display = "none"; // Hide new password step
}

function togglePasswordVisibility(passwordFieldId, eyeIcon) {
    const passwordField = document.getElementById(passwordFieldId);
    const isPasswordVisible = passwordField.type === "text"; // Check if the password is currently visible

    if (isPasswordVisible) {
        passwordField.type = "password"; // Change to password type
        eyeIcon.textContent = "👁️"; // Change eye icon to closed
    } else {
        passwordField.type = "text"; // Change to text type
        eyeIcon.textContent = "👁️"; // Change eye icon to open
    }
}
