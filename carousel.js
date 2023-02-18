const buttons = document.querySelectorAll('[data-carousel-button]')
const allSlides =document.querySelectorAll('[data-slides]')
const allSlidesRes =document.querySelectorAll('[data-slides-res]')
let mobCarousel=document.getElementById('mob-carousel')
let ellipses=document.querySelectorAll('[data-carousel-ellipse]')
let firstEllipse=document.getElementById('ellipse1')
let midEllipse=document.getElementById('ellipse2')
let lastEllipse=document.getElementById('ellipse3')
let firstSlide=document.getElementById('firstSlide')
let midSlide=document.getElementById('midSlide')
let lastSlide=document.getElementById('lastSlide')
let allActiveSlides=[]
let slideNo=0
let scrollx=0

function scrollFunction(){
    scrollx=mobCarousel.scrollLeft.toFixed()
    let activeEllipses=document.querySelector('[data-active-ellipse]')
    if(scrollx >= 0){
        if(scrollx < 980 ){
            
            firstEllipse.dataset.activeEllipse=true
            delete activeEllipses.dataset.activeEllipse
        }
        
    }
    if(scrollx >= 980 ){
        if(scrollx <=1938 ){

            midEllipse.dataset.activeEllipse=true
            delete activeEllipses.dataset.activeEllipse

        }
    }
    if(scrollx > 1938){
        if(scrollx <= 2000){

            
            lastEllipse.dataset.activeEllipse=true
            delete activeEllipses.dataset.activeEllipse
        }
        
    }
    
    
}
setInterval(function showCarousel(){
    if(scrollx >= 1960){
        mobCarousel.scrollLeft = 0
    }else{
        mobCarousel.scrollLeft +=980
    }
    
},8000)
let isClicked=false
if(!isClicked){
setInterval(function showCarousel(){
    allSlides.forEach((slides,index) =>{
        const activeSlide=slides.querySelector('[data-active]')
        let newIndex =[...slides.children].indexOf(activeSlide) + 1
        if(newIndex < 0) newIndex=slides.children.length - 1
        if(newIndex >=slides.children.length) newIndex=0
        slides.children[newIndex].dataset.active=true
        delete activeSlide.dataset.active 
    })
 
},5000)
}
buttons.forEach(button =>{
    button.addEventListener('click',(e)=>{
        isClicked=true
        const offSet=button.dataset.carouselButton === 'next' ? 1 : -1
        const slides = button.closest('[data-carousel]').querySelector('[data-slides]')
        const activeSlide=slides.querySelector('[data-active]')
        let newIndex =[...slides.children].indexOf(activeSlide) + offSet
        if (newIndex < 0) newIndex=slides.children.length -1
        if (newIndex >= slides.children.length) newIndex =0
        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
})