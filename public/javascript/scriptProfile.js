const deleteButton = document.querySelector('#delete-button')
const deleteAccountButton = document.querySelector('#delete-account')

deleteButton.addEventListener("click", ()=>{
    if(deleteAccountButton.disabled === false){
        deleteAccountButton.disabled = true
    }else{
        deleteAccountButton.disabled = false
    }
})