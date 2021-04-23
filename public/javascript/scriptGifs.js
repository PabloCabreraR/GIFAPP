const acc = document.querySelectorAll(".accordion")

// const images = [...acc]

acc.forEach(image=>{
    image.addEventListener("click", function(){
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
        })
})

