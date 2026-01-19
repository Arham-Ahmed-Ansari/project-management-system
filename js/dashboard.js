// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getFirestore, addDoc, deleteDoc, updateDoc, onSnapshot, collection, query, where, doc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


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
const db = getFirestore(app);

let currentUserId = null;


onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    document.getElementById("userEmail").innerHTML = user.email;
    currentUserId = user.uid;
    getProjects();
});


window.logoutUser = async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
        alert("User Logout ✔");

    } catch (error) {
        console.log(error);
    }
}


window.addProject = async () => {
    try {
        let projectName = document.getElementById("projectName").value;

        if (!projectName) {
            alert("please enter the project name");
            return;
        }

        await addDoc(collection(db, "projects"), {
            projectName: projectName,
            uid: currentUserId,
        })

        alert("Project Added Sucessfully ✔");
        document.getElementById("projectName").value = "";

    } catch (error) {
        console.log(error);
    }
}


function getProjects() {
    const q = query(collection(db, "projects"), where("uid", "==", currentUserId));

    onSnapshot(q, (snapshot) => {

        let projectCard = document.getElementById("projectCard");
        projectCard.innerHTML = "";

        snapshot.forEach(doc => {

            projectCard.innerHTML += `
            <div class="getCard">
            <h4>${doc.data().projectName}</h4>
                <div class="actions">
                    <button class="primary-btn viewProject" onclick = "openProject('${doc.id}')">Open</button>
                    <button class="danger-btn" onclick = "deleteProject('${doc.id}')">Delete</button>
                </div>
                </div>
            `

        });


    })
}


window.deleteProject = async (id) => {
    try {
        await deleteDoc(doc(db, "projects", id));
        alert("Project Deleted Sucessfully ✔");
        return;
    } catch (error) {
        console.log(error);
    }
}


window.openProject = async (id) => {
    try {
        window.location.href = `project.html?projectId=${id}`;
    } catch (error) {
        console.log(error);
    }
}




