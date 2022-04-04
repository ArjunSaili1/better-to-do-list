
function bindSwitchProject(getToDos, projectList) {
    const childArray = [...projectList.children];
    childArray.forEach((project) => {
      if (project.tagName === "LI") {
        project.addEventListener("click", getToDos);
      }
    });
}

function cancelNewProject(e) {
    e.target.parentNode.style.display = "none";
    document
      .querySelector("#cancel-project-add")
      .removeEventListener("click", cancelNewProject);
}

function toggleNewProjectDisplay(makeNewProject) {
    const inputCtn = document.querySelector("#add-project-input-container");
    inputCtn.style.display = "flex";
    document
      .querySelector("#confirm-project-add")
      .addEventListener("click", makeNewProject);
    document
      .querySelector("#cancel-project-add")
      .addEventListener("click", cancelNewProject);
}

export { toggleNewProjectDisplay, bindSwitchProject}