window.addEventListener("orientationchange", () => {
    const turnDiv = document.querySelector('.turn-device')
    if ( window.orientation == 0 || window.orientation == 180) {
        turnDiv.classList.add('displaynone')
    } else {
        turnDiv.classList.remove('displaynone') 
    }
  }, false);




document.body.requestFullscreen()