// Accessibility fixes for Material for MkDocs elements that cannot be
// patched via template overrides (generated in base.html).
document.addEventListener("DOMContentLoaded", function () {
  // The drawer overlay label is generated in base.html as a bare empty
  // <label class="md-overlay" for="__drawer"> with no accessible text.
  // Remove the for attribute to avoid "multiple form labels" (the hamburger
  // label in header.html is the single authoritative label for __drawer).
  // Restore click-to-close behavior via onclick.
  var overlay = document.querySelector("label.md-overlay");
  if (overlay) {
    overlay.setAttribute("aria-label", "Close navigation");
    overlay.removeAttribute("for");
    overlay.addEventListener("click", function () {
      var drawer = document.getElementById("__drawer");
      if (drawer) drawer.checked = false;
    });
  }
});
