const deleteButton = document.querySelector('#delete-button')
const deleteAccountButton = document.querySelector('#delete-account')

deleteButton.addEventListener("click", ()=>{
    if(deleteAccountButton.disabled === false){
        deleteAccountButton.disabled = true
    }else{
        deleteAccountButton.disabled = false
    }
})





const acc = document.querySelectorAll(".accordion")

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