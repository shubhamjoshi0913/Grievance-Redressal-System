const url='https://backend-server-ohpm.onrender.com'

document.addEventListener('DOMContentLoaded', () => {
    // Handle dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            dropdown.classList.toggle('active');
            const content = dropdown.querySelector('.dropdown-content');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Handle sidebar link clicks to show the relevant section
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Handle sign-out button click
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);

    // Change password form submission
    document.getElementById('change-password-form')?.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const password = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }
        if (password === newPassword) {
            alert('New password cannot be the same as the current password.');
            return;
        }

        try {
            // Send change password request to the backend
            const response = await fetch('https://backend-server-ohpm.onrender.com/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password:password,
                }),
            });

            const data = await response.json();
            console.log(await data);
            if (response.ok) {
                // Handle successful password change
                alert('Password changed successfully.');
                document.getElementById('change-password-form').reset();
            } else {
                // Handle error messages from the server
                alert(data.message || 'Failed to change password. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while changing the password. Please try again later.');
        }
    });

    // Change email form submission
 
        // Handle form submission to update email
        document.getElementById('change-profile-form')?.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const oldEmail = document.getElementById('old-email-input').value;
            const newEmail = document.getElementById('edit-profile-email').value;
            console.log(newEmail)
            // Validate email format
            if (!validateEmail(newEmail)) {
                alert('Invalid new email address.');
                return;
            }
    
            try {
                // Send the email update request to the backend
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/change-email/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Ensure JSON format, // Include token for authorization
                    },
                    body: JSON.stringify({
                        oldEmail: oldEmail,  // Include both old and new emails in the body
                        newEmail: newEmail
                    }),
                });
    
                const data = await response.json();
                console.log(await data);
                if (response.ok) {
                    document.getElementById('edit-profile-success-message').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('edit-profile-success-message').style.display = 'none';
                    }, 3000); // Hide success message after 3 seconds
                    document.getElementById('change-profile-form').reset(); // Reset form after submission
                } else {
                    throw new Error(data || 'Failed to update email.');
                }
            } catch (error) {
                console.error('Error updating email:', JSON.stringify(error));
                alert('An error occurred while updating the email. Please try again later.');
            }
        });
    
        // Function to validate email format
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    });
    



 // Sign out function
 function signOut() {
    window.location.href = 'index.html'; // Adjust the URL to match your login page
 }

// Function to hide error messages after 2 seconds
async function hideErrorAfterTimeout(element) {
    setTimeout(() => {
        element.style.display = 'none';
    }, 2000);
}




    async function getApprovedMember(collection){
        try{
            const response = await fetch(url+'/api/v1/get_approved_users');
            const responseJson = await response.json();
            if(collection=="student"){
                return responseJson[0];
            }
            else if(collection=="teacher"){
                return responseJson[1];
            }
            else{
                return responseJson[2];
            }
        }
        catch(error){
            console.log("error");
            alert(`${error} caused failure`);
        }

    }




    async function getNotApprovedMember(collection){
        try{
            const response = await fetch(url+"/api/v1/admin/get_pending_approval_users");
            const responseJson = await response.json();
            if(collection=="student"){
                return responseJson[0];
            }
            else if(collection=="teacher"){
                return responseJson[1];
            }
            else{
                return responseJson[2];
            }
        }
        catch(error){
            console.log("error");
            alert(`${error} caused failure`);
        }

    }

    

     // Function to display pending students
     async function displayStudents() {
        const students = await getNotApprovedMember("student");
        const tbody = document.querySelector('#studentTable tbody');
        
        tbody.innerHTML = ''; // Clear existing entries
        
        students.forEach((student, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${student.name}</td>
               <td>${student.gender}</td>
               <td>${student.course}</td>
               <td>${student.batch}</td>
               <td>${student.roll_no}</td>
               <td>${student.email}</td>
               <td>${student.contact_number}</td>
               <td>
                   <button class="approveStudentBtn" data-index="${student.user_id}" data-type="student">Approve</button>
               </td>
           `;
           tbody.appendChild(row);
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveStudentBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.getAttribute('data-index');
               const type=this.getAttribute('data-type')
               console.log(`${index},${type}`);
               approveStudent(index,type);
           });
       });
   
       
   }
   
   // Function to display approved students
   async function displayApprovedStudents() {
       const approvedStudents = await getApprovedMember("student");
      
       const tbody = document.querySelector('#approvedStudents tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       approvedStudents.forEach((student, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${student.name}</td>
               <td>${student.gender}</td>
               <td>${student.course}</td>
               <td>${student.batch}</td>
               <td>${student.roll_no}</td>
               <td>${student.email}</td>
               <td>${student.contact_number}</td>
               <td><button class="deleteStudentBtn" data-index="${student.user_id}">Delete</button></td>
           `;
           tbody.appendChild(row);
       });
   
       document.querySelectorAll('.deleteStudentBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteStudent(index);
           });
       });
   }
   
   // Function to delete a student
   async function deleteStudent(index) {
    const userData={
        "user_id":index,
        "user_type":'student',
        "approved":false
    }
    console.log(userData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())

       displayApprovedStudents();
       displayStudents();  // Refresh the displayed list
   }
   
   // Function to delete approved student

   
   // Function to approve a student
   async function approveStudent(index,type) {
    const userData={
        "user_id":index,
        "user_type":type,
        "approved":true
    }
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())
   
       // Refresh both tables
       displayStudents();
       displayApprovedStudents();
   }
   
   
   // Function to display pending teachers
   async function displayTeachers() {
       const teachers = await getNotApprovedMember('teacher');
       const tbody = document.querySelector('#teacherTable tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       teachers.forEach((teacher, index) => {
           // Check if the teacher is valid and has the necessary properties
           if (teacher && teacher.name) { 
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${teacher.name}</td>
                   <td>${teacher.gender || 'N/A'}</td>
                   <td>${teacher.department || 'N/A'}</td>
                   <td>${teacher.designation || 'N/A'}</td>
                   <td>${teacher.email || 'N/A'}</td>
                   <td>${teacher.contact_number || 'N/A'}</td>
                   <td>
                       <button class="approveTeacherBtn" data-index="${teacher.user_id}"">Approve</button>
                   </td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn('Teacher at index ${index} is null or missing name', teacher); // Log the problematic teacher entry
           }
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.getAttribute('data-index');
               approveTeacher(index);
           });
       });
   
       document.querySelectorAll('.deleteTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteTeacher(index);
           });
       });
   }
   
   // Function to display approved teachers
   async function displayApprovedTeachers() {
       const approvedTeachers = await getApprovedMember('teacher');
       
       const tbody = document.querySelector('#approvedTeachers tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       approvedTeachers.forEach((teacher, index) => {
           // Check if the teacher is valid and has the necessary properties
           if (teacher && teacher.name) {
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${teacher.name}</td>
                   <td>${teacher.gender || 'N/A'}</td>
                   <td>${teacher.department || 'N/A'}</td>
                   <td>${teacher.designation || 'N/A'}</td>
                   <td>${teacher.email || 'N/A'}</td>
                   <td>${teacher.contact_number || 'N/A'}</td>
                   <td><button class="deleteTeacherBtn" data-index="${teacher.user_id}">Delete</button></td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn('Approved teacher at index ${index} is null or missing name', teacher); // Log the problematic teacher entry
           }
       });
   
       document.querySelectorAll('.deleteTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.getAttribute('data-index');
               const type = 'teacher';
                console.log(index);
               deleteTeacher(index,type);
           });
       });
   }
   
   // Function to approve a teacher
   async function approveTeacher(index,type) {
    const userData={
        "user_id":index,
        "user_type":"teacher",
        "approved":true
    }
    console.log(userData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())
   
       // Refresh both tables
       displayTeachers();
       displayApprovedTeachers();
   }
   
   // Function to delete a teacher
   async function deleteTeacher(index) {
    const userData={
        "user_id":index,
        "user_type":'teacher',
        "approved":false
    }
    console.log(userData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())

       displayApprovedTeachers();
       displayTeachers(); // Refresh the displayed list
   }
   
   // Function to delete approved teacher
  
   
   
   
   // Function to display pending staff
   async function displayStaff() {
    const staff = await getNotApprovedMember('staff');
    console.log(staff);
       const tbody = document.querySelector('#staffTable tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       staff.forEach((staffMember, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${staffMember.name}</td>
               <td>${staffMember.gender || 'N/A'}</td>
               <td>${staffMember.department || 'N/A'}</td>
               <td>${staffMember.designation || 'N/A'}</td>
               <td>${staffMember.email || 'N/A'}</td>
               <td>${staffMember.contact_number || 'N/A'}</td>
               <td>
                   <button class="approveStaffBtn" data-index="${staffMember.user_id}">Approve</button>
                  
               </td>
           `;
           tbody.appendChild(row);
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               approveStaff(index);
           });
       });
   
       document.querySelectorAll('.deleteStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteStaff(index);
           });
       });
   }
   // Function to display approved staff

   async function displayApprovedStaff() {
        const approvedStaff = await getApprovedMember('staff');
       const tbody = document.querySelector('#approvedStaff tbody');
       tbody.innerHTML = ''; // Clear existing entries
    
       approvedStaff.forEach((staffMember, index) => {
           // Check if staffMember is defined
           if (staffMember && staffMember.name) {
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${staffMember.name}</td>
                   <td>${staffMember.gender || 'N/A'}</td>
                   <td>${staffMember.department || 'N/A'}</td>
                   <td>${staffMember.designation || 'N/A'}</td>
                   <td>${staffMember.email || 'N/A'}</td>
                   <td>${staffMember.contact_number || 'N/A'}</td>
                   <td><button class="deleteStaffBtn" data-index="${staffMember.user_id}">Delete</button></td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn(`Approved staff member at index ${index} is null or missing name`, staffMember);
           }
       });
   
       document.querySelectorAll('.deleteStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteStaff(index);
           });
       });
   }
   
   // Function to delete a staff member
   async function deleteStaff(index) {
       const userData={
        "user_id":index,
        "user_type":"staff",
        "approved":false
    }
    console.log(userData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())
   
       // Refresh both tables
       displayStaff();
       displayApprovedStaff();
       
   }
   
   
   async function approveStaff(index) {
    const userData={
        "user_id":index,
        "user_type":'staff',
        "approved":true
    }
    console.log(userData);
    const response = await fetch(`https://backend-server-ohpm.onrender.com/api/v1/admin/approve_user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())
   
       // Refresh both tables
       displayStaff();
       displayApprovedStaff();
   }
   
   // Define a single function to initialize the display of all entities
   function initialize() {
       displayStudents();          // Call to display students
       displayTeachers();          // Call to display teachers
       displayApprovedStudents();  // Call to display approved students
       displayApprovedTeachers();  // Call to display approved teachers
       displayStaff();             // Call to display staff
       displayApprovedStaff();     // Call to display approved staff
   }
   
   
   // Assign the initialize function to window.onload
   window.onload = initialize;
   
   // Handling student form submission
   document.getElementById('student-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('student-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const course = document.getElementById('course').value;
       const batch = document.getElementById('batch').value;
       const roll_no = document.getElementById('roll-no').value;
       const email = document.getElementById('email').value;
       const mobile_no = document.getElementById('contact-number').value;
       const password = document.getElementById('password').value;
   
       const studentData = { name, gender, course, batch, roll_no, email, mobile_no,password };
   
       // Save the data to local storage
       const existingStudents = JSON.parse(localStorage.getItem('students')) || [];
       existingStudents.push(studentData);
       localStorage.setItem('students', JSON.stringify(existingStudents));
       
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed students
       displayStudents();
   });
   
   // Handling teacher form submission
   document.getElementById('teacher-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('teacher-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const department = document.getElementById('department').value;
       const designation = document.getElementById('designation').value;
       const email = document.getElementById('teacher-email').value;
       const mobile_no = document.getElementById('teacher-contact').value;
       const password = document.getElementById('password').value;
   
       const teacherData = { name, gender, department, designation, email, mobile_no, password };
   
       // Save the data to local storage
       const existingTeachers = JSON.parse(localStorage.getItem('teachers')) || [];
       existingTeachers.push(teacherData);
       localStorage.setItem('teachers', JSON.stringify(existingTeachers));
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed teachers
       displayTeachers();
   });
   
   // Handling staff form submission
   document.getElementById('staff-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('staff-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const department = document.getElementById('staff-department').value;
       const designation = document.getElementById('staff-designation').value; // Corrected from 'designation' to 'staff-designation'
       const email = document.getElementById('staff-email').value;
       const mobile_no = document.getElementById('staff-contact').value;
       const password = document.getElementById('password').value;
   
       const staffData = { name, gender, department, designation, email, mobile_no, password };
   
       // Save the data to local 
       const existingStaff = JSON.parse(localStorage.getItem('staff')) || [];
       existingStaff.push(staffData);
       localStorage.setItem('staff', JSON.stringify(existingStaff));
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed staff
       displayStaff();
    });
   
   
   
   
   
   

