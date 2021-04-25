const deleteButton = document.querySelector('#delete-button')
const deleteAccountButton = document.querySelector('#delete-account')

deleteButton.addEventListener("click", () => {
    deleteAccountButton.classList.toggle('displaynone')
})


const accordion = document.querySelectorAll(".accordion")

accordion.forEach(image=>{
    image.addEventListener("click", () => {
        image.classList.toggle("active");
        let panel = image.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
        })
})

const editButton = document.querySelector('#edit-button')
const editForm = document.querySelector('#edit-form')

editButton.addEventListener("click", () => {
    editForm.classList.toggle('displaynone')
})