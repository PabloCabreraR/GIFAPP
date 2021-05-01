const accordion = document.querySelectorAll(".accordion")

accordion.forEach(image=>{
    image.addEventListener("click", () => {
        image.classList.toggle("active")
        let panel = image.nextElementSibling
        if (panel.style.display === "block") {
            panel.style.display = "none"
        } else {
            panel.style.display = "block"
        }
        })
})

const favbutton = document.querySelectorAll(".favbutton")

favbutton.forEach(button => {
    button.addEventListener('click', ()=>{
        button.setAttribute("style", "background-color: black;")
    })
})