import { appLogic } from "./index";

const displayControl = (() =>{

    const projectList = document.querySelector("#project-list");
    const toDoListHtml = document.querySelector("#to-do-list")
    const toDoHeading = document.querySelector("#todo-heading");
    let currentProjectId = 'inbox';

    function render(){
        clearPage();
        document.querySelector(".menu-screen-overlay").classList.remove("open-menu");
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
                    const largeToDoWrapper = document.createElement('div');
                    const toDoWrapper = document.createElement('div');
                    toDoWrapper.classList.add("to-do-obj");
                    const toDoMain = document.createElement("div");
                    toDoMain.id = 'to-do-wrapper';
                    const checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    const toDoObj = document.createElement("li");
                    toDoObj.classList.add("to-do-name");
                    toDoObj.textContent = project.getToDos()[i].getTitle();
                    toDoObj.id = project.getToDos()[i].getId();
                    const toDoTime = document.createElement("div");
                    toDoTime.id = "to-do-time";
                    if(project.getToDos()[i].getPriority() == 'high'){
                        toDoWrapper.style.backgroundColor = '#ff6e40'
                    }
                    if(project.getToDos()[i].getPriority() == 'medium'){
                        toDoWrapper.style.backgroundColor = "#feb05a";
                    }
                    if(project.getToDos()[i].getPriority() == 'low'){
                        toDoWrapper.style.backgroundColor = "#fee17b";
                    }
                    if(project.getToDos()[i].getDueDate()){
                        toDoTime.textContent = project.getToDos()[i].getDueDate().replace('T', ' ');
                    }
                    toDoWrapper.appendChild(checkbox);
                    toDoWrapper.appendChild(toDoObj);
                    toDoWrapper.appendChild(toDoTime);
                    toDoWrapper.appendChild(createIcons());
                    largeToDoWrapper.appendChild(toDoWrapper);
                    toDoListHtml.appendChild(largeToDoWrapper);
                    const descriptionSection = createDescriptionNotesSection(project.getToDos()[i].getDescription(), project.getToDos()[i].getNotes());
                    descriptionSection.id = project.getToDos()[i].getId();
                    toDoListHtml.appendChild(descriptionSection)
                    checkbox.addEventListener("click",compeleteTask)
                }
            }
            projectList.appendChild(newProject);
        }
        projectList.appendChild(createProjectAddSection());
        bindEvents();
    }

    function createDescriptionNotesSection(descriptionTxt, noteTxt){
        const descriptionWrapper = document.createElement('div');
        descriptionWrapper.classList.add("description-note-wrapper");
        const descriptionHeading = document.createElement('div');
        descriptionHeading.classList.add("description-note-heading");
        descriptionHeading.textContent = "Description";
        const descriptionTextContainer = document.createElement('div');
        descriptionTextContainer.classList.add("description-note-text-container");
        const descriptionText = document.createElement('div');
        descriptionText.classList.add("description-note-text");
        descriptionText.textContent = descriptionTxt;
        descriptionTextContainer.appendChild(descriptionText);
        const noteHeading = document.createElement("div");
        noteHeading.classList.add("description-note-heading");
        noteHeading.textContent = "Notes";
        const noteTextContainer = document.createElement('div');
        noteTextContainer.classList.add("description-note-text-container");
        const noteText = document.createElement('div');
        noteText.classList.add("description-note-text");
        noteText.textContent = noteTxt;
        noteTextContainer.appendChild(noteText);
        descriptionWrapper.appendChild(descriptionHeading);
        descriptionWrapper.appendChild(descriptionTextContainer);
        descriptionWrapper.appendChild(noteHeading);
        descriptionWrapper.appendChild(noteTextContainer);
        return descriptionWrapper;
    }

    function compeleteTask(e){
        setTimeout(()=>{appLogic.deleteToDoByID((locateToDo(e.target.parentNode.children)).getId())}, 100);
        //do some animation
    }

    function createIcons(){
        const icons = ['edit', 'delete', 'keyboard_arrow_down'];
        const iconsContainer = document.createElement('div');
        iconsContainer.id = 'icons-container';
        const iconsWrapper = document.createElement('div');
        iconsWrapper.id = 'icons-wrapper';
        iconsWrapper.classList.add('to-do-actions');
        for(let i=0;i<icons.length;i++){
            const newIcon = document.createElement('span');
            newIcon.classList.add("material-icons");
            newIcon.textContent = icons[i];
            newIcon.classList.add('icon');
            iconsWrapper.appendChild(newIcon);
        }
        iconsWrapper.children[2].id = 'open-description-dropdown';
        iconsWrapper.children[2].addEventListener("click", openDescriptionDropdown);
        iconsWrapper.children[1].id = "delete-to-do";
        iconsWrapper.children[1].addEventListener("click", deleteToDo);
        iconsWrapper.children[0].id = "edit-to-do";
        iconsWrapper.children[0].addEventListener("click", displayEditModal);
        iconsContainer.appendChild(iconsWrapper);    
        return iconsContainer;
    }

    function openDescriptionDropdown(e){
        e.target.parentNode.parentNode.parentNode.parentNode.nextSibling.classList.toggle("show-display");
        if(e.target.textContent == "keyboard_arrow_down"){
            e.target.textContent = "keyboard_arrow_up";
        }
        else{
            e.target.textContent = "keyboard_arrow_down";
        }
    }

    function deleteToDo(e){
        appLogic.deleteToDoByID(locateToDo(e.target.parentNode.parentNode.parentNode.children).getId());
    }

    function createProjectAddSection(){
        const container = document.createElement("div");
        container.id = "add-project-container";
        const addProjectWrapper = document.createElement("div");
        addProjectWrapper.id = "add-project-wrapper";
        const addIcon = document.createElement('span');
        addIcon.classList.add("material-icons");
        addIcon.id = "add-project-icon";
        addIcon.textContent = "add_circle_outline";
        const addProjectButton = document.createElement("div");
        addProjectButton.id="add-project-button";
        addProjectButton.textContent = "Add Project";
        addProjectWrapper.appendChild(addIcon);
        addProjectWrapper.appendChild(addProjectButton);
        container.appendChild(addProjectWrapper);
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
        container.appendChild(addProjectInputContainer);
        return container;
    }

    function bindEvents(){
        for(let i=0; i < appLogic.allProjects.length; i++){
            const project = document.querySelector("#" + appLogic.allProjects[i].getId());
            project.addEventListener("click", switchProject);
        }
        document.querySelector("#open-menu").addEventListener("click", openSideMenu)
        document.querySelector("#add-project-wrapper").addEventListener("click", displayProjectAdd);
        document.querySelector("#add-to-do").addEventListener("click", displayCreateModal);
        document.querySelector("#home").addEventListener("click", (e)=>{
            document.querySelector("#inbox").click();
        })
    }

    function openSideMenu(e){
        const menuOverlay = document.querySelector(".menu-screen-overlay");
        const overlay = document.querySelector("#overlay")
        menuOverlay.classList.toggle("open-menu");
        overlay.addEventListener("click", ()=>{menuOverlay.classList.remove("open-menu");})
    }

    function displayCreateModal(e){
        const displayModal = document.querySelector(".modal-view")
        const modalTitle = document.querySelector(".modal-title");
        const modalForm = document.querySelector(".modal-form");
        const submitButton = document.querySelector("#submit-to-do-modal");
        const allInputs = document.querySelectorAll(".to-do-input");
        for(let i=0;i<allInputs.length;i++){
            allInputs[i].value = '';
        }
        submitButton.value = "Create To Do";
        modalForm.id = "create-modal-form";
        modalTitle.textContent = "Create New To Do";
        displayModal.style.display = 'flex';
        document.querySelector(".close-modal").addEventListener("click", closeModal);
        populateProjectDropdown();
        document.querySelector("#create-modal-form").addEventListener("submit", makeToDo);
    }

    function displayEditModal(e){
        const selectedToDo = locateToDo(e.target.parentNode.parentNode.parentNode.children);
        document.querySelector("#to-do-title").value = selectedToDo.getTitle();
        document.querySelector("#to-do-description").value = selectedToDo.getDescription();
        document.querySelector("#to-do-due-date").value = selectedToDo.getDueDate();
        document.querySelector("#priority").value = selectedToDo.getPriority();
        document.querySelector("#project-list-create-to-do").value = selectedToDo.getProject().getName();
        document.querySelector("#to-do-notes").value = selectedToDo.getNotes();
        const displayModal = document.querySelector(".modal-view")
        const modalTitle = document.querySelector(".modal-title");
        const modalForm = document.querySelector(".modal-form");
        const submitButton = document.querySelector("#submit-to-do-modal");
        submitButton.value = "Edit To Do";
        modalForm.id = "edit-modal-form";
        modalTitle.textContent = "Edit To Do";
        displayModal.style.display = 'flex';
        document.querySelector(".close-modal").addEventListener("click", closeModal);
        populateProjectDropdown();
        addClickEditHandler(selectedToDo)
    }

    function locateToDo(todoobj){
        for(let i=0; i<= todoobj.length; i++){
            if(todoobj[i]){
                if(todoobj[i].tagName == 'LI'){
                    return appLogic.getToDoByID(todoobj[i].id);
                }
            }
        }
    }

    function addClickEditHandler(selectedToDo){
        document.querySelector("#edit-modal-form").addEventListener("submit", function(e){
            editToDo(e, selectedToDo);
        });
    }

    function closeModal(e){
        e.target.id = "modal-form";
        const displayModal = document.querySelector(".modal-view");
        displayModal.style.display = "none";
        document.querySelector(".close-modal").removeEventListener("click", closeModal);
        const submitButton = document.querySelector("#submit-to-do-modal");
        submitButton.value = "";
        const modalForm = document.querySelector(".modal-form");
        const modalFormClone = modalForm.cloneNode(true);
        modalForm.parentNode.replaceChild(modalFormClone, modalForm);

    }

    function populateProjectDropdown(){
        const dropdown = document.querySelector("#project-list-create-to-do")
        dropdown.innerHTML = '';
        for(let i =0; i< appLogic.allProjects.length; i++){
            const newOption = document.createElement("option");
            newOption.setAttribute("projectId", appLogic.allProjects[i].getId())
            newOption.value = appLogic.allProjects[i].getName();
            newOption.classList.add('project-select');
            newOption.textContent = appLogic.allProjects[i].getName();
            dropdown.appendChild(newOption);
        }
    }

    function editToDo(e, selectedToDo){
        e.preventDefault();
        appLogic.deleteToDoByID(selectedToDo.getId());
        makeToDo(e);
        document.querySelector(".close-modal").click();
    }

    function makeToDo(e){
        e.preventDefault();
        const title = document.querySelector("#to-do-title").value;
        const description = document.querySelector("#to-do-description").value;
        const dueDate = document.querySelector("#to-do-due-date").value;
        const priority = document.querySelector("#priority").value;
        const projectValue = document.querySelector("#project-list-create-to-do").value;
        const projectSelects = document.querySelectorAll('.project-select');
        let projectId = null;
        for(let i=0;i<projectSelects.length;i++){
            if(projectSelects[i].textContent == projectValue){
                projectId = projectSelects[i].getAttribute('projectId')
            }
        }
        const notes = document.querySelector("#to-do-notes").value;
        appLogic.createToDo(title, description, dueDate, priority, notes, getProjectFromId(projectId));

        document.querySelector(".close-modal").click();
    }

    function getProjectFromId(id){
        for(let i=0;i<appLogic.allProjects.length;i++){
            if(appLogic.allProjects[i].getId()== id){
                return appLogic.allProjects[i];
            }
        }
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