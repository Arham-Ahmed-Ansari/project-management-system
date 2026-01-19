// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getFirestore, addDoc, deleteDoc, updateDoc, onSnapshot, collection, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


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

const url = new URL(window.location);
const projectId = url.searchParams.get("projectId");
console.log(projectId);

let currentUserId = null;
let editCurrentId = null;

onAuthStateChanged(auth, (user) => {
    currentUserId = user.uid;
})


async function getProject() {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap) {
        document.getElementById("projectName").innerHTML = projectSnap.data().projectName;
        getTask();
    } else {
        console.log("No Document Found");
    }
}

getProject();




window.backToDashboard = () => {
    window.location.href = "dashboard.html";
}


window.addTask = async () => {
    try {

        let taskName = document.getElementById("taskName").value;
        let taskPriority = document.getElementById("taskPriority").value;
        let taskStatus = document.getElementById("taskStatus").value;
        let taskDate = document.getElementById("taskDate").value;

        if (!taskName || !taskPriority || !taskStatus || !taskDate) {
            alert("please enter all the details");
            return;
        }

        if (editCurrentId) {
            await updateDoc(doc(db, "tasks", editCurrentId), {
                taskName,
                taskPriority,
                taskStatus,
                taskDate,
            });
            alert("Task updated Sucessfully ✔");
            document.getElementById("taskName").value = "";

            document.getElementById("taskPriority").value = "";
            document.getElementById("taskStatus").value = "";

            document.getElementById("taskDate").value = "";
        }

        else {

            await addDoc(collection(db, "tasks"), {
                taskName: taskName,
                taskPriority: taskPriority,
                taskStatus: taskStatus,
                taskDate: taskDate,
                projectId: projectId,
                uid: currentUserId,
            })

            alert("Task Added Sucessfully ✔");

            document.getElementById("taskName").value = "";

            document.getElementById("taskPriority").value = "";
            document.getElementById("taskStatus").value = "";

            document.getElementById("taskDate").value = "";

        }

    } catch (error) {
        console.log(error);
    }
}


function getTask() {
    const q = query(collection(db, "tasks"), where("projectId", "==", projectId), where("uid", "==", currentUserId));

    onSnapshot(q, (snapshot) => {

        let taskCard = document.getElementById("taskCard");
        taskCard.innerHTML = "";

        if (snapshot.size == 0) {
            document.getElementById("emptyTask").innerHTML = "No Task Yet";
        } else {
            snapshot.forEach(doc => {
                taskCard.innerHTML += `
            <div class = "taskCard">
               <div>
                    <h4>${doc.data().taskName}</h4>
                    <p>Priority: ${doc.data().taskPriority}</p>
                    <p>Date: ${doc.data().taskDate}</p>
                </div>
                <span>${doc.data().taskStatus}</span><br>
                <button class = "deleteBtn" onclick = "deleteTask('${doc.id}')">Delete</button>
                <button class = "editBtn" onclick = "editTask('${doc.id}','${doc.data().taskName}','${doc.data().taskPriority}','${doc.data().taskDate}','${doc.data().taskStatus}')">Edit</button>
                </div>
            `
            });
        }
    })
}


window.deleteTask = async (id) => {
    try {
        await deleteDoc(doc(db, "tasks", id));
        alert("task deleted sucessfully ✔");
    } catch (error) {
        console.log(error);
    }
}

window.editTask = async (id, taskName, taskPriority, taskDate, taskStatus) => {
    document.getElementById("taskName").value = taskName;

    document.getElementById("taskPriority").value = taskPriority;
    document.getElementById("taskStatus").value = taskStatus;

    document.getElementById("taskDate").value = taskDate;

    editCurrentId = id;


}





