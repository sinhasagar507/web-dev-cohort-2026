const btn = document.getElementById("toggleButton");
const heading = document.querySelector("h1"); // Select the H1 tag

btn.addEventListener("click", () => {
    // 1. Toggle the class as you were doing
    document.body.classList.toggle("dark");

    // 2. Check if the body now has the "dark" class
    if (document.body.classList.contains("dark")) {
        heading.textContent = "Toggle to Light Mode"; 
    } else {
        heading.textContent = "Toggle to Dark Mode";
    }
});