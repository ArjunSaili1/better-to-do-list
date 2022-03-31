import { ToDo } from "./ToDo";
import { Project } from './project';
import { displayControl } from "./displayControl";
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import './style.css';

const appLogic = (() => {

    const firebaseConfig = {
        apiKey: "AIzaSyDGAt1LX_0ujKSxY0H8alH3x_VDz7YG2Xo",
        authDomain: "to-do-list-b4206.firebaseapp.com",
        projectId: "to-do-list-b4206",
        storageBucket: "to-do-list-b4206.appspot.com",
        messagingSenderId: "559736845573",
        appId: "1:559736845573:web:4ab2d4034244dbd0fff36c"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const allProjects = [];
    let currentProject = Project("Inbox", [], "inbox");

    async function startUp(){
        allProjects.push(currentProject);
        createToDo("Get Groceries", "Go to Fortinos", "7/10/2021T7:00", "high", "Get Frozen Pizza", currentProject);
        createToDo("Clean out cupboard", "Use Vacuum", "7/10/2021T12:00", "medium", "Very Dusty", currentProject);
        createToDo("Watch Squid Game", "Need to Update Netflix Subscription", "7/10/2021T:22:00" ,"low", "Upgrade Account", currentProject);
    }

    function getToDoByID(id){
        for(let i=0;i<currentProject.getToDos().length;i++){
            if (currentProject.getToDos()[i].getId() == id){
                    return (currentProject.getToDos()[i]);
            }
        }
    }

    function editToDo(todo, newTitle, newDescription, newDueDate, newPriority, newNotes, newProject){
        todo.setTitle(newTitle);
        todo.setDescription(newDescription);
        todo.setDueDate(newDueDate);
        todo.setPriority(newPriority);
        todo.setNotes(newNotes);
        todo.setProject(newProject);
        currentProject.deleteToDo(todo);
        render(db);
    }

    function deleteToDoByID(id){
        currentProject.deleteToDo(getToDoByID(id));
        displayControl.render(db);
    }

    function createToDo(title, description, dueDate, priority, notes, project){
        const newToDo = ToDo(title, description, dueDate, priority, notes, "b" + uuidv4(), project);
        project.addToDo(newToDo);
        displayControl.render(db);
    }

    async function createProject(projName){
        try{
            const projectRef = await addDoc(collection(db, "projects"),{
                name: projName,
                id: uuidv4(),
            });
            allProjects.push(projectRef);
        }catch(e){
            console.error("There was an issue in creating a project: ", e)
        }
    }

    function getCurrentProject(){
        for(let i = 0; i < allProjects.length; i++){
            if(allProjects[i].getId() == displayControl.getCurrentProjectId()){
                currentProject = allProjects[i]
            }
        }
        return currentProject;
    }

    return { getCurrentProject, startUp, currentProject, allProjects, createToDo, createProject, deleteToDoByID, getToDoByID, editToDo}
})();

appLogic.startUp();

export { appLogic } 