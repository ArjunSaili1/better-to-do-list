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
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
        createToDo("Watch Squid Game with Heli", null, null, null, null, Today1);
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
        console.log(priority)
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