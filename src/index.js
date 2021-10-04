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
        const Today1 = createProject("Today", [], "a" + uuidv4());
        const Today2 = createProject("Today", [], "a" +  uuidv4());
        const Today3 = createProject("Today", [], "a" + uuidv4());        
        const Today4 = createProject("Today", [], "a" + uuidv4());        
        const Today5 = createProject("Today", [], "a" + uuidv4());        
        const Today6 = createProject("Today", [], "a" + uuidv4());        
        createToDo("test","test",124,"test","test", currentProject)
        createToDo("test2","test2",124,"test2","test2", Today1)
        createToDo("test3","test2",124,"test2","test2", Today2)
        createToDo("test4","test3",124,"test3","test3", Today3)
    }

    function createToDo(title, description, dueDate, priority, notes, project){
        const newToDo = ToDo(title, description, dueDate, priority, notes, "b" + uuidv4(), project);
        project.addToDo(newToDo);
        displayControl.render();
    }

    function createProject(name, todos, id){
        const newProject = Project(name, todos, id);
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

    return { getCurrentProject, startUp, currentProject, allProjects, createToDo, createProject}
})();


appLogic.startUp();

export { appLogic } 