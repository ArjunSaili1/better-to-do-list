import { appLogic } from "./index";

const displayControl = (() =>{

    const projectList = document.querySelector("#project-list");
    const toDoListHtml = document.querySelector("#to-do-list")
    const toDoHeading = document.querySelector("#todo-heading");
    let currentProjectId = 'inbox';

    function render(){
        clearPage();
        for(let i=0; i < appLogic.allProjects.length; i++){
            const project = appLogic.allProjects[i];
            const newProject = document.createElement('li');
            newProject.textContent = project.getName();
            newProject.classList.add("project-list");
            newProject.id = project.getId();
            if(newProject.id == currentProjectId){
                newProject.style.fontWeight = 'bold';
                toDoHeading.textContent = newProject.textContent;
            }
            projectList.appendChild(newProject);
            if(project.getId() == currentProjectId){
                for(let i = 0; i<project.getToDos().length; i++){
                    const toDoWrapper = document.createElement('div');
                    toDoWrapper.classList.add("to-do-obj");
                    const checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    const toDoObj = document.createElement("li");
                    toDoObj.classList.add("to-do-name");
                    toDoObj.textContent = project.getToDos()[i].getTitle();
                    toDoObj.id = project.getToDos()[i].getId();
                    toDoWrapper.appendChild(checkbox);
                    toDoWrapper.appendChild(toDoObj);
                    toDoListHtml.appendChild(toDoWrapper);
                }
            }
        }
        bindEvents();
    }

    function bindEvents(){
        for(let i=0; i< appLogic.allProjects.length; i++){
            const project = document.querySelector("#" + appLogic.allProjects[i].getId());
            project.addEventListener("click", switchProject);
        }
    }

    function switchProject(e){
        currentProjectId = e.target.id;
        render();
        appLogic.getCurrentProject();
    }


    function clearPage(){
        projectList.innerHTML = '';
        toDoListHtml.innerHTML = '';
    }

    function getCurrentProjectId(){
        return currentProjectId;
    }

    return {render, getCurrentProjectId}
})();

export { displayControl }