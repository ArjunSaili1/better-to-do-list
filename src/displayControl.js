import { appLogic } from "./index";
import { getDocs, collection, deleteDoc, updateDoc, addDoc} from 'firebase/firestore'

const displayControl = (() =>{

    const projectList = document.querySelector("#project-list");
    const toDoListHtml = document.querySelector("#to-do-list")
    const toDoHeading = document.querySelector("#todo-heading");
    let currentProjectId = null;
    let projCol;
    let database;
    
    let allProjects = [];

    window.onload = ()=>{
        document.querySelector("#add-project-wrapper").addEventListener('click', toggleNewProjectDisplay);
    }

    function createElementWithProps(elementType, elementClass, elementId, elementText){
        const newElement = document.createElement(elementType);
        elementClass ? newElement.classList = elementClass : null;
        elementId ? newElement.id = elementId: null;
        elementText ? newElement.textContent = elementText : null;
        return newElement;
    }

    function addChilds(parent, children){
        children.forEach((child)=>{
            parent.appendChild(child);
        })
    }

    function render(db){
        database = db;
        projCol = collection(db, 'projects');
        document.querySelector(".menu-screen-overlay").classList.remove("open-menu");
        getDocs(projCol).then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                console.log(doc.data().name)
                if(allProjects.indexOf(doc.id) !== -1){return;}
                allProjects.push(doc.id)
                const name = doc.data().name;
                const newProject = createElementWithProps('li', "project-list", doc.id, name);
                currentProjectId == null ? currentProjectId = doc.id : currentProjectId = null;
                if(newProject.id === currentProjectId){
                    newProject.style.fontWeight = "bold";
                    toDoHeading.textContent = newProject.textContent;
                    const toDos = collection(db, 'projects', doc.id, 'toDos');
                    renderToDos(toDos)
                }
                projectList.appendChild(newProject);
            })
        })
    }

    function renderToDos(toDos){
        getDocs(toDos).then((snapshot)=>{
            snapshot.docs.forEach((toDo)=>{
                const title = toDo.data().title;
                const priorityRef = toDo.data().priority
                const largeToDoWrapper = createElementWithProps("div");
                const toDoWrapper = createElementWithProps('div', 'to-do-obj');
                const toDoMain = createElementWithProps('div', null, 'to-do-wrapper');
                const checkBox = createElementWithProps('input');
                checkBox.type = "checkbox";
                checkBox.addEventListener("click", deleteToDo.bind(null, toDo))
                const toDoObj = createElementWithProps('li', 'to-do-name', toDo.id, title);
                const toDoTime = createElementWithProps('div', null, 'to-do-time');
                priorityRef == "high" ? toDoWrapper.style.backgroundColor = '#ff6e40' : null
                priorityRef == "medium" ? toDoWrapper.style.backgroundColor = "#feb05a" : null
                priority == "low" ? toDoWrapper.style.backgroundColor = "#fee17b" : null
                addChilds(toDoWrapper, [checkBox, toDoObj, toDoTime, createIcons(toDo)])
                largeToDoWrapper.appendChild(toDoWrapper);
                toDoListHtml.appendChild(largeToDoWrapper)
                const descriptionSection = createDescriptionNotesSection(toDo.data().description, toDo.data().notes);
                descriptionSection.id = "description-" + toDo.data().id
                toDoListHtml.appendChild(descriptionSection)

            })
        })
    }

    function createIcons(doc){
        const icons = ['edit', 'delete', 'keyboard_arrow_down'];
        const iconsContainer = createElementWithProps('div', null, 'icons-wrapper');
        const iconsWrapper = createElementWithProps('div', 'to-do-actions', 'icons-wrapper');
        icons.forEach((icon)=>{
            const newIcon = createElementWithProps('span', "material-icons", null, icon);
            newIcon.classList.add('icon');
            iconsWrapper.appendChild(newIcon);
        })
        iconsWrapper.children[2].id = 'open-description-dropdown';
        iconsWrapper.children[2].addEventListener("click", openDescriptionDropdown);
        iconsWrapper.children[1].id = "delete-to-do";
        iconsWrapper.children[1].addEventListener("click", deleteToDo.bind(null, doc));
        iconsWrapper.children[0].id = "edit-to-do";
        iconsWrapper.children[0].addEventListener("click", displayEditModal.bind(null, doc));
        iconsContainer.appendChild(iconsWrapper);    
        return iconsContainer;
    }

    function createDescriptionNotesSection(descriptionTxt, noteTxt){
        const descriptionWrapper = createElementWithProps('div', "description-note-wrapper");
        const descriptionHeading = createElementWithProps('div', "description-note-heading", null, "Description");
        const descriptionTextContainer = createElementWithProps('div', "description-note-text-container");
        const descriptionText = createElementWithProps('div', "description-note-text", null, descriptionTxt);
        descriptionTextContainer.appendChild(descriptionText);
        const noteHeading = createElementWithProps('div', "description-note-heading", null, "Notes");
        const noteTextContainer = createElementWithProps('div', "description-note-text-container");
        const noteText = createElementWithProps('div', "description-note-text", null, noteTxt);
        noteTextContainer.appendChild(noteText);
        addChilds(descriptionWrapper, [descriptionHeading, descriptionTextContainer, noteHeading, noteTextContainer]);
        return descriptionWrapper;
    }

    async function deleteToDo(doc){
        await deleteDoc(doc.ref)
        location.reload()
    }

    function openDescriptionDropdown(e){
        e.target.parentNode.parentNode.parentNode.parentNode.nextSibling.classList.toggle("show-display");
        const text = e.target.textContent
        text == "keyboard_arrow_down" ? text = "keyboard_arrow_up" : text = "keyboard_arrow_down";
    }

    function displayEditModal(toDoRef){
        const toDo = toDoRef.data();
        document.querySelector("#to-do-title").value = toDo.title;
        document.querySelector("#to-do-description").value = toDo.description;
        document.querySelector("#to-do-due-date").value = toDo.dueDate;
        document.querySelector("#priority").value = toDo.priority
        document.querySelector("#to-do-notes").value = toDo.notes;
        document.querySelector(".modal-view").style.display = 'flex';
        document.querySelector(".modal-title").textContent = "Edit To Do";
        document.querySelector(".modal-form").id = "edit-modal-form";
        document.querySelector("#submit-to-do-modal").value = "Edit To Do";
        document.querySelector(".close-modal").addEventListener("click", closeModal);
        populateProjectDropdown();
        addClickEditHandler(toDoRef);
    }

    function addClickEditHandler(toDoRef){
        document.querySelector("#edit-modal-form").addEventListener("submit", function(e){
            editToDo(e, toDoRef);
        });
    }

    async function editToDo(e, selectedToDo){
        e.preventDefault();
        await updateDoc(selectedToDo.ref, {
            title: e.target[0].value,
            description: e.target[1].value,
            dueDate: e.target[2].value,
            priority: e.target[3].value,
            notes: e.target[5].value
        })
        location.reload()
    }

    function closeModal(e){
        e.target.id = "modal-form";
        document.querySelector(".modal-view").style.display = "none";;
        document.querySelector(".close-modal").removeEventListener("click", closeModal);
        document.querySelector("#submit-to-do-modal").value = "";
        const modalForm = document.querySelector(".modal-form");
        const modalFormClone = modalForm.cloneNode(true);
        modalForm.parentNode.replaceChild(modalFormClone, modalForm);
    }

    function populateProjectDropdown(){
        const dropdown = document.querySelector("#project-list-create-to-do")
        dropdown.innerHTML = '';
        getDocs(projCol).then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                const name = doc.data().name
                let project = createElementWithProps("option", "to-do-input", "project-list-create-to-do", name)
                project.value = name;
                dropdown.appendChild(project);
            })
        })
    }

    function toggleNewProjectDisplay(e){
        const inputCtn = document.querySelector("#add-project-input-container")
        inputCtn.style.display = 'flex';
        document.querySelector("#confirm-project-add").addEventListener('click', newProject)
        document.querySelector("#cancel-project-add").addEventListener("click", cancelNewProject);
    }

    function cancelNewProject(e){
        e.target.parentNode.style.display = "none";
        document.querySelector("#cancel-project-add").removeEventListener("click", cancelNewProject);
    }

    async function newProject(e){
        await addDoc(collection(database, "projects"),{
            name: e.target.parentNode.children[0].value
        })
        location.reload()
    }

 /*        for(let i=0; i < appLogic.allProjects.length; i++){
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

    function locateToDo(todoobj){
        for(let i=0; i<= todoobj.length; i++){
            if(todoobj[i]){
                if(todoobj[i].tagName == 'LI'){
                    return appLogic.getToDoByID(todoobj[i].id);
                }
            }
        }
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

    function switchProject(e){
        currentProjectId = e.target.id;
        render();
        appLogic.getCurrentProject();
    }

    function getCurrentProjectId(){
        return currentProjectId;
    } */

    return {render}
})();

export { displayControl }