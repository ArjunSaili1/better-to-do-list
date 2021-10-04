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
            projectList.appendChild(newProject);
        }
        projectList.appendChild(createProjectAddSection());
        bindEvents();
    }

    function createProjectAddSection(){
        const container = document.createElement("div");
        container.id = "add-project-container";
        const flexContainer = document.createElement("div");
        flexContainer.id = "add-project-flex-container";
        const addProjectButton = document.createElement("button");
        addProjectButton.id="add-project-button";
        addProjectButton.textContent = "Add Project";
        flexContainer.appendChild(addProjectButton);
        const addProjectInputContainer = document.createElement('div');
        addProjectInputContainer.id = "add-project-input-container";
        const addProjectInput = document.createElement("input");
        addProjectInput.id = "add-project-input";
        addProjectInputContainer.appendChild(addProjectInput);
        const confirmButton = document.createElement("button");
        confirmButton.classList.add("project-add-confirm-buttons");
        confirmButton.id = "confirm-project-add";
        addProjectInputContainer.appendChild(confirmButton);
        const cancelButton = document.createElement("button");
        cancelButton.classList.add("project-add-confirm-buttons");
        cancelButton.id = "cancel-project-add";
        cancelButton.textContent = "×";
        confirmButton.textContent = "✓";
        addProjectInputContainer.appendChild(cancelButton);
        flexContainer.appendChild(addProjectInputContainer);
        container.appendChild(flexContainer)
        return container;
    }

    function bindEvents(){
        for(let i=0; i < appLogic.allProjects.length; i++){
            const project = document.querySelector("#" + appLogic.allProjects[i].getId());
            project.addEventListener("click", switchProject);
        }
        document.querySelector("#add-project-button").addEventListener("click", displayProjectAdd);
    }

    function displayProjectAdd(e){
        document.querySelector("#add-project-input-container").style.display = 'flex';
        document.querySelector("#cancel-project-add").addEventListener("click", cancelNewProject);
        document.querySelector("#confirm-project-add").addEventListener("click", generateNewProject);
    }

    function cancelNewProject(e){
        document.querySelector("#cancel-project-add").removeEventListener("click", cancelNewProject);
        document.querySelector("#confirm-project-add").removeEventListener("click", generateNewProject);
        document.querySelector("#add-project-input-container").style.display = 'none';
    }

    function generateNewProject(e){
        const inputValue = e.path[1].childNodes[0].value;
        if(inputValue){
            appLogic.createProject(e.path[1].childNodes[0].value, []);
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