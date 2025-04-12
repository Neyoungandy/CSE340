document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("account_password");
  
    togglePassword.addEventListener("click", function () {
      // Check the current type of the password field
      const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
  
      // Update the button text
      this.textContent = type === "password" ? "Show Password" : "Hide Password";
    });
  });
  