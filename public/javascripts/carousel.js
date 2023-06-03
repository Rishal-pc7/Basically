
async function showMoreImages(e){
    let scrollLeft=e.scrollLeft.toFixed()
    let btns=document.getElementsByClassName('ellipsis-btn')
    let activeEllipse=document.getElementsByClassName('active-ellipse')
    if(scrollLeft <900){
        activeEllipse[0].classList.replace('active-ellipse','.')
        btns[0].className +=' active-ellipse'
    }
    if(scrollLeft >900 && scrollLeft <1900){

            activeEllipse[0].classList.replace('active-ellipse','.')
            btns[1].className +=' active-ellipse'
    }
    if(scrollLeft >1900 && scrollLeft < 2900 ){

            activeEllipse[0].classList.replace('active-ellipse','.')
            btns[2].className +=' active-ellipse'
        
    }
    if(scrollLeft >2900 && scrollLeft < 3900 ){

            activeEllipse[0].classList.replace('active-ellipse','.')
            btns[3].className +=' active-ellipse'
        
    }
    if(scrollLeft >3900 && scrollLeft < 4900 ){

            activeEllipse[0].classList.replace('active-ellipse','.')
            btns[4].className +=' active-ellipse'
        
    }
    if(scrollLeft >4900 && scrollLeft < 5900 ){

            activeEllipse[0].classList.replace('active-ellipse','.')
            btns[5].className +=' active-ellipse'
        
    }
    
   
}
