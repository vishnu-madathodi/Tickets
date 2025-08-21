function brandingChangeName(newName) {
  try {
    const brandEl = document.querySelector(".right-info-list p.brand-color");
    if (brandEl) {
      brandEl.innerText = newName;

      if (window.getComputedStyle(brandEl).display === "none") {
        brandEl.style.display = "block";
      }
    }

    const dpInfoEl = document.querySelector(".dp-info p");
    if (dpInfoEl) {
      const firstTextNode = dpInfoEl.childNodes[0];
      if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
        firstTextNode.textContent = newName + "\n";
      }
    }
  } catch (exception) {
    console.error(`Error in the function: brandingChangeName; ${exception}`);
  }
}
