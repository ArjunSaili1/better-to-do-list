function openSideMenu() {
    const menuOverlay = document.querySelector(".menu-screen-overlay");
    const overlay = document.querySelector("#overlay");
    menuOverlay.classList.toggle("open-menu");
    overlay.addEventListener("click", () => {
      menuOverlay.classList.remove("open-menu");
    });
}

export default openSideMenu;