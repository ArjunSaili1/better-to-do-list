import closeModal from "../utils/closeModal";

function addClickEditHandler(toDoRef, editToDo) {
  document.querySelector("#edit-modal-form").addEventListener("submit", (e) => {
    editToDo(e, toDoRef);
  });
}

function displayEditModal(toDoRef, editToDo) {
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
  document.querySelector(".close-modal").addEventListener("click", closeModal);
  addClickEditHandler(toDoRef, editToDo);
}

export default displayEditModal;
