import closeModal from "../utils/closeModal";

function displayCreateModal(makeToDo) {
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
  document.querySelector(".close-modal").addEventListener("click", closeModal);
  document
    .querySelector("#create-modal-form")
    .addEventListener("submit", makeToDo);
}

export default displayCreateModal;
