import "./style.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

const displayControl = (() => {
  const projectList = document.querySelector("#project-list");
  const toDoListHtml = document.querySelector("#to-do-list");
  const toDoHeading = document.querySelector("#todo-heading");
  let currentProjectId = null;
  let projCol;
  const allProjects = [];

  const firebaseConfig = {
    apiKey: "AIzaSyDGAt1LX_0ujKSxY0H8alH3x_VDz7YG2Xo",
    authDomain: "to-do-list-b4206.firebaseapp.com",
    projectId: "to-do-list-b4206",
    storageBucket: "to-do-list-b4206.appspot.com",
    messagingSenderId: "559736845573",
    appId: "1:559736845573:web:4ab2d4034244dbd0fff36c",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  function bindEvents() {
    document
      .querySelector("#open-menu")
      .addEventListener("click", openSideMenu);
    document
      .querySelector("#add-project-wrapper")
      .addEventListener("click", toggleNewProjectDisplay);
    document
      .querySelector("#add-to-do")
      .addEventListener("click", displayCreateModal);
  }

  function bindSwitchProject() {
    const childArray = [...projectList.children];
    childArray.forEach((project) => {
      if (project.tagName === "LI") {
        project.addEventListener("click", getToDos);
      }
    });
  }

  function createElementWithProps(
    elementType,
    elementClass,
    elementId,
    elementText
  ) {
    const newElement = document.createElement(elementType);
    if (elementClass) {
      newElement.classList = elementClass;
    }
    if (elementId) {
      newElement.id = elementId;
    }
    if (elementText) {
      newElement.textContent = elementText;
    }
    return newElement;
  }

  function addChilds(parent, children) {
    children.forEach((child) => {
      parent.appendChild(child);
    });
  }

  function render() {
    projCol = collection(db, "projects");
    renderProjects();
  }

  function renderProjects() {
    getDocs(projCol).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (allProjects.indexOf(doc.id) !== -1) {
          return;
        }
        allProjects.push(doc.id);
        const { name } = doc.data();
        const newProject = createElementWithProps(
          "li",
          "project-list",
          doc.id,
          name
        );
        projectList.appendChild(newProject);
        bindSwitchProject();
        console.log(projectList);
        if (currentProjectId === null) {
          projectList.children[projectList.children.length - 1].click();
        }
      });
    });
  }

  function getToDos(e) {
    currentProjectId = e.target.id;
    toDoListHtml.innerHTML = "";
    toDoHeading.textContent = e.target.textContent;
    const toDos = collection(db, "projects", e.target.id, "toDos");
    renderToDos(toDos);
  }

  function renderToDos(toDos) {
    getDocs(toDos).then((snapshot) => {
      snapshot.docs.forEach((toDo) => {
        const { title } = toDo.data();
        const priorityRef = toDo.data().priority;
        const largeToDoWrapper = createElementWithProps("div");
        const toDoWrapper = createElementWithProps("div", "to-do-obj");
        const checkBox = createElementWithProps("input");
        checkBox.type = "checkbox";
        checkBox.addEventListener("click", deleteToDo.bind(null, toDo));
        const toDoObj = createElementWithProps(
          "li",
          "to-do-name",
          toDo.id,
          title
        );
        const toDoTime = createElementWithProps("div", null, "to-do-time");
        if (priorityRef === "high") {
          toDoWrapper.style.backgroundColor = "#ff6e40";
        }
        if (priorityRef === "medium") {
          toDoWrapper.style.backgroundColor = "#feb05a";
        }
        if (priorityRef === "low") {
          toDoWrapper.style.backgroundColor = "#fee17b";
        }
        addChilds(toDoWrapper, [
          checkBox,
          toDoObj,
          toDoTime,
          createIcons(toDo),
        ]);
        largeToDoWrapper.appendChild(toDoWrapper);
        toDoListHtml.appendChild(largeToDoWrapper);
        const descriptionSection = createDescriptionNotesSection(
          toDo.data().description,
          toDo.data().notes
        );
        descriptionSection.id = `description-${toDo.data().id}`;
        toDoListHtml.appendChild(descriptionSection);
      });
    });
  }

  function createIcons(doc) {
    const icons = ["edit", "delete", "keyboard_arrow_down"];
    const iconsContainer = createElementWithProps("div", null, "icons-wrapper");
    const iconsWrapper = createElementWithProps(
      "div",
      "to-do-actions",
      "icons-wrapper"
    );
    icons.forEach((icon) => {
      const newIcon = createElementWithProps(
        "span",
        "material-icons",
        null,
        icon
      );
      newIcon.classList.add("icon");
      iconsWrapper.appendChild(newIcon);
    });
    iconsWrapper.children[2].id = "open-description-dropdown";
    iconsWrapper.children[2].addEventListener("click", openDescriptionDropdown);
    iconsWrapper.children[1].id = "delete-to-do";
    iconsWrapper.children[1].addEventListener(
      "click",
      deleteToDo.bind(null, doc)
    );
    iconsWrapper.children[0].id = "edit-to-do";
    iconsWrapper.children[0].addEventListener(
      "click",
      displayEditModal.bind(null, doc)
    );
    iconsContainer.appendChild(iconsWrapper);
    return iconsContainer;
  }

  function createDescriptionNotesSection(descriptionTxt, noteTxt) {
    const descriptionWrapper = createElementWithProps(
      "div",
      "description-note-wrapper"
    );
    const descriptionHeading = createElementWithProps(
      "div",
      "description-note-heading",
      null,
      "Description"
    );
    const descriptionTextContainer = createElementWithProps(
      "div",
      "description-note-text-container"
    );
    const descriptionText = createElementWithProps(
      "div",
      "description-note-text",
      null,
      descriptionTxt
    );
    descriptionTextContainer.appendChild(descriptionText);
    const noteHeading = createElementWithProps(
      "div",
      "description-note-heading",
      null,
      "Notes"
    );
    const noteTextContainer = createElementWithProps(
      "div",
      "description-note-text-container"
    );
    const noteText = createElementWithProps(
      "div",
      "description-note-text",
      null,
      noteTxt
    );
    noteTextContainer.appendChild(noteText);
    addChilds(descriptionWrapper, [
      descriptionHeading,
      descriptionTextContainer,
      noteHeading,
      noteTextContainer,
    ]);
    return descriptionWrapper;
  }

  async function deleteToDo(doc) {
    await deleteDoc(doc.ref);
    window.location.reload();
  }

  function openDescriptionDropdown(e) {
    e.target.parentNode.parentNode.parentNode.parentNode.nextSibling.classList.toggle(
      "show-display"
    );
    let text = e.target.textContent;
    if (text === "keyboard_arrow_down") {
      text = "keyboard_arrow_up";
    } else {
      text = "keyboard_arrow_down";
    }
  }

  function displayEditModal(toDoRef) {
    const toDo = toDoRef.data();
    document.querySelector("#to-do-title").value = toDo.title;
    document.querySelector("#to-do-description").value = toDo.description;
    document.querySelector("#to-do-due-date").value = toDo.dueDate;
    document.querySelector("#priority").value = toDo.priority;
    document.querySelector("#to-do-notes").value = toDo.notes;
    document.querySelector(".modal-view").style.display = "flex";
    document.querySelector(".modal-title").textContent = "Edit To Do";
    document.querySelector(".modal-form").id = "edit-modal-form";
    document.querySelector("#submit-to-do-modal").value = "Edit To Do";
    document
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);
    addClickEditHandler(toDoRef);
  }

  function addClickEditHandler(toDoRef) {
    document
      .querySelector("#edit-modal-form")
      .addEventListener("submit", (e) => {
        editToDo(e, toDoRef);
      });
  }

  async function editToDo(e, selectedToDo) {
    e.preventDefault();
    await updateDoc(selectedToDo.ref, {
      title: e.target[0].value,
      description: e.target[1].value,
      dueDate: e.target[2].value,
      priority: e.target[3].value,
      notes: e.target[5].value,
    });
    window.location.reload();
  }

  function closeModal() {
    document.querySelector(".modal-view").style.display = "none";
    document
      .querySelector(".close-modal")
      .removeEventListener("click", closeModal);
    document
      .querySelector("#create-modal-form")
      .removeEventListener("submit", makeToDo);
  }

  function toggleNewProjectDisplay() {
    const inputCtn = document.querySelector("#add-project-input-container");
    inputCtn.style.display = "flex";
    document
      .querySelector("#confirm-project-add")
      .addEventListener("click", makeNewProject);
    document
      .querySelector("#cancel-project-add")
      .addEventListener("click", cancelNewProject);
  }

  function cancelNewProject(e) {
    e.target.parentNode.style.display = "none";
    document
      .querySelector("#cancel-project-add")
      .removeEventListener("click", cancelNewProject);
  }

  async function makeNewProject(e) {
    e.preventDefault();
    await addDoc(collection(db, "projects"), {
      name: e.target.parentNode.children[0].value,
    });
    window.location.reload();
  }

  function openSideMenu() {
    const menuOverlay = document.querySelector(".menu-screen-overlay");
    const overlay = document.querySelector("#overlay");
    menuOverlay.classList.toggle("open-menu");
    overlay.addEventListener("click", () => {
      menuOverlay.classList.remove("open-menu");
    });
  }

  function displayCreateModal() {
    const displayModal = document.querySelector(".modal-view");
    const modalTitle = document.querySelector(".modal-title");
    const modalForm = document.querySelector(".modal-form");
    const submitButton = document.querySelector("#submit-to-do-modal");
    const allInputs = document.querySelectorAll(".to-do-input");
    allInputs.forEach((input) => {
      input.value = "";
    });
    submitButton.value = "Create To Do";
    modalForm.id = "create-modal-form";
    modalTitle.textContent = "Create New To Do";
    displayModal.style.display = "flex";
    document
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);
    document
      .querySelector("#create-modal-form")
      .addEventListener("submit", makeToDo);
  }

  async function makeToDo(e) {
    e.preventDefault();
    await addDoc(collection(db, "projects", currentProjectId, "toDos"), {
      title: e.target[0].value,
      description: e.target[1].value,
      dueDate: e.target[2].value,
      priority: e.target[3].value,
      notes: e.target[4].value,
    });
    window.location.reload();
  }

  window.onload = () => {
    bindEvents();
    render();
  };

  return { render };
})();

export { displayControl };
