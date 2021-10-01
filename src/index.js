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
        appLogic.createProject("Today", ["Abc", "Abc", "123"], "a" + uuidv4());
        appLogic.createProject("Today", [], "a" +  uuidv4());
        appLogic.createProject("Today", [], "a" + uuidv4());        
    }

    function createToDo(title, description, dueDate, priority, notes, project){
        currentProject.addToDo(ToDo(title, description, dueDate, priority, notes, project))
        displayControl.render();
    }

    function createProject(name, todos, id){
        const newProject = Project(name, todos, id);
        allProjects.push(newProject);
        displayControl.render();
    }

    function getCurrentProject(){
        for(let i = 0; i < allProjects.length; i++){
            if(allProjects[i].getId() == displayControl.getCurrentProjectId()){
                currentProject = allProjects[i]
            }
        }
        return currentProject;
    }

    return { getCurrentProject, startUp, currentProject, allProjects, createToDo, createProject}
})();


appLogic.startUp();

export { appLogic } 