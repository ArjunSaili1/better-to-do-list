import displayEditModal from "./editToDoModal";
import {createElementWithProps, addChildren} from '../utils/domHelpers'

function createIcons(doc, deleteToDo, editToDo) {
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
      displayEditModal.bind(null, doc, editToDo)
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
    addChildren(descriptionWrapper, [
      descriptionHeading,
      descriptionTextContainer,
      noteHeading,
      noteTextContainer,
    ]);
    return descriptionWrapper;
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

export { createDescriptionNotesSection, createIcons}