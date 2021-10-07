import { ToDo } from "./ToDo";
import { Project } from './project';
import { displayControl } from "./displayControl";
import { v4 as uuidv4 } from 'uuid';
import './style.css';

const appLogic = (() => {

    const allProjects = [];
    let currentProject = Project("Inbox", [], "inbox");

    function startUp(){
        allProjects.push(currentProject);
        const Today1 = createProject("Today", []);  
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
        render();
    }

    function deleteToDoByID(id){
        currentProject.deleteToDo(getToDoByID(id));
        displayControl.render();
    }

    function createToDo(title, description, dueDate, priority, notes, project){
        const newToDo = ToDo(title, description, dueDate, priority, notes, "b" + uuidv4(), project);
        project.addToDo(newToDo);
        displayControl.render();
    }

    function createProject(name, todos){
        const newProject = Project(name, todos, "a" + uuidv4());
        allProjects.push(newProject);
        displayControl.render();
        return newProject;
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