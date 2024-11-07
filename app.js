// Initialize SQL.js and the database
let db;
initDb();

async function initDb() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.wasm`
  });

  db = new SQL.Database();
  db.run(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      dob TEXT,
      class TEXT,
      address TEXT,
      phone TEXT,
      email TEXT
    )
  `);

  displayStudents(); // Call to display students on initialization
}

document.getElementById("admissionForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const studentData = {
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    class: document.getElementById("class").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value
  };

  db.run(`
    INSERT INTO students (name, dob, class, address, phone, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [studentData.name, studentData.dob, studentData.class, studentData.address, studentData.phone, studentData.email]);

  document.getElementById("admissionForm").reset();
  displayStudents(); // Update the display after submission
});

function displayStudents() {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = ""; // Clear the current list

  const results = db.exec("SELECT * FROM students");

  if (results.length > 0) {
    results[0].values.forEach((row, index) => {
      const studentItem = document.createElement("p");
      studentItem.innerHTML = `
        <strong>Student ${index + 1}</strong><br>
        Name: ${row[1]}<br>
        Date of Birth: ${row[2]}<br>
        Class: ${row[3]}<br>
        Address: ${row[4]}<br>
        Phone: ${row[5]}<br>
        Email: ${row[6]}<br>
      `;
      studentList.appendChild(studentItem);
    });
  } else {
    studentList.innerHTML = "<p>No students registered yet.</p>";
  }
}

// Function to generate and download PDF of student data
function downloadStudentDataPDF() {
  const password = prompt("Enter the password to download the PDF:");

  if (password !== "hello") {  // Replace with your desired password
    alert("Incorrect password. Access denied.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text("Registered Students", 10, 10);

  const results = db.exec("SELECT * FROM students");
  let yPosition = 20;

  if (results.length > 0) {
    results[0].values.forEach((row, index) => {
      const studentInfo = `
        Student ${index + 1}
        Name: ${row[1]}
        Date of Birth: ${row[2]}
        Class: ${row[3]}
        Address: ${row[4]}
        Phone: ${row[5]}
        Email: ${row[6]}
      `;
      doc.text(studentInfo, 10, yPosition);
      yPosition += 30;
    });
  } else {
    doc.text("No students registered yet.", 10, yPosition);
  }

  doc.save("student_data.pdf");
}
// Show footer only when scrolled to bottom
window.addEventListener('scroll', function() {
  const footerTaskbar = document.getElementById('footerTaskbar');
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    footerTaskbar.style.display = 'flex'; // Show footer at the bottom
  } else {
    footerTaskbar.style.display = 'none'; // Hide footer
  }
});

// Show success popup
document.getElementById('admissionForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Here, add the logic for saving data, like saving to SQLite or localStorage.
  
  // Show success popup after saving data
  document.getElementById('successPopup').style.display = 'block';
});

// Close success popup
function closePopup() {
  document.getElementById('successPopup').style.display = 'none';
}
document.getElementById("admissionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        class: document.getElementById("class").value,
        address: document.getElementById("address").value
    };

    try {
        // Add data to Firestore
        await db.collection("students").add(studentData);
        alert("Student registered successfully!");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to register student.");
    }
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_7w5CHxN0lALM2goJEP57DES3H5tEDkg",
  authDomain: "school-admission-form-2e43e.firebaseapp.com",
  projectId: "school-admission-form-2e43e",
  storageBucket: "school-admission-form-2e43e.firebasestorage.app",
  messagingSenderId: "367257051736",
  appId: "1:367257051736:web:a7c48e508e6db33d05a02d",
  measurementId: "G-Q4TKC2NXPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
