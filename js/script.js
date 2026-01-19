// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVQAc4Q1VriYDVHWG0vjF9ne2fVKHTCkU",
    authDomain: "project-management-syste-de3d5.firebaseapp.com",
    projectId: "project-management-syste-de3d5",
    storageBucket: "project-management-syste-de3d5.firebasestorage.app",
    messagingSenderId: "738969991412",
    appId: "1:738969991412:web:02d9958d6d090f6aa986a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.registerUser = async () => {
    try {
        const signUpName = document.getElementById("signUpName").value;
        const signUpEmail = document.getElementById("signUpEmail").value;
        const signUpPassword = document.getElementById("signUpPassword").value;

        if (!signUpName || !signUpEmail || !signUpPassword) {
            alert("Please Enter All the deatils");
            return;
        }

        await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);

        alert("User Sucessfully Registered ✔");

        document.getElementById("signUpName").value = "";
        document.getElementById("signUpEmail").value = "";
        document.getElementById("signUpPassword").value = "";

    } catch (error) {
        console.log(error);
    }
}


window.loginUser = async () => {
    try {
        let loginEmail = document.getElementById("loginEmail").value;
        let loginPassword = document.getElementById("loginPassword").value;

        if (!loginEmail || !loginPassword) {
            alert("please enter all the details");
            return;
        }

        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        alert("User Sucessfully Login ✔");

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";


    } catch (error) {
        console.log(error);
    }
}


onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("User is Not Loged In ❌");
        return;
    }
    window.location.href = "dashboard.html";
})