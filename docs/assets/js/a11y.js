// Accessibility fixes for Material for MkDocs elements that cannot be
// patched via template overrides (generated in base.html).
document.addEventListener("DOMContentLoaded", function () {
  // The drawer overlay label is generated in base.html as a bare empty
  // <label class="md-overlay" for="__drawer"> with no accessible text.
  var overlay = document.querySelector("label.md-overlay");
  if (overlay) {
    overlay.setAttribute("aria-label", "Close navigation");
  }
});
