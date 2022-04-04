function closeModal() {
  document.querySelector(".modal-view").style.display = "none";
  document
    .querySelector(".close-modal")
    .removeEventListener("click", closeModal);
  document
    .querySelector("#create-modal-form")
    .removeEventListener("submit", makeToDo);
}

export default closeModal;
