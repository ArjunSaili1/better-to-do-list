import { appLogic } from "./index";

const displayControl = (() =>{

    const projectList = document.querySelector("#project-list");
    let currentProjectId = 'inbox';

    function render(){
        clearProjects();
        for(let i=0; i < appLogic.allProjects.length; i++){
            const project = appLogic.allProjects[i];
            const newProject = document.createElement('li');
            newProject.textContent = project.getName();
            newProject.classList.add("project-list");
            newProject.id = project.getId();
            if(newProject.id == currentProjectId){
                newProject.style.fontWeight = 'bold';
            }
            projectList.appendChild(newProject);
            if(project.getId() == currentProjectId){
                for(let i = 0; i<project.getToDos().length; i++){
                    
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


    function clearProjects(){
        projectList.innerHTML = '';
    }

    function getCurrentProjectId(){
        return currentProjectId;
    }

    return {render, getCurrentProjectId}
})();

export { displayControl }