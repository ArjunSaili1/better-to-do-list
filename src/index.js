import "./style.css";
import db from "./firebase";
import displayCreateModal from "./elements/createToDoModal";
import { createElementWithProps, addChildren } from "./utils/domHelpers";
import { createIcons, createDescriptionNotesSection } from "./elements/toDoSections";
import {toggleNewProjectDisplay, bindSwitchProject} from "./elements/projects";
import openSideMenu from "./elements/openSideMenu";
import {
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

  function bindEvents() {
    document
      .querySelector("#open-menu")
      .addEventListener("click", openSideMenu);
    document
      .querySelector("#add-project-wrapper")
      .addEventListener("click", toggleNewProjectDisplay.bind(null, makeNewProject));
    document
      .querySelector("#add-to-do")
      .addEventListener("click", displayCreateModal.bind(null, makeToDo));
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
        bindSwitchProject(getToDos, projectList);
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
        addChildren(toDoWrapper, [
          checkBox,
          toDoObj,
          toDoTime,
          createIcons(toDo, deleteToDo, editToDo),
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

  async function deleteToDo(doc) {
    await deleteDoc(doc.ref);
    window.location.reload();
  }

  async function editToDo(e, selectedToDo) {
    e.preventDefault();
    await updateDoc(selectedToDo.ref, {
      title: e.target[0].value,
      description: e.target[1].value,
      dueDate: e.target[2].value,
      priority: e.target[3].value,
      notes: e.target[4].value,
    });
    window.location.reload();
  }

  async function makeNewProject(e) {
    e.preventDefault();
    await addDoc(collection(db, "projects"), {
      name: e.target.parentNode.children[0].value,
    });
    window.location.reload();
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
  };

  return { render };
})();

displayControl.render();

export { displayControl };
