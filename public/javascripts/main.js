
let navbar =document.getElementById('navbar')
let mobNav =document.getElementById('mob-nav')
let content =document.getElementById('content')
let txtContent =document.getElementById('txtContent')
let linksColl=document.getElementsByClassName('links')
let chatBtn=document.getElementById('chatBtn')
let chatPopup=document.getElementById('chatPopup')
let closeBtn=document.getElementById('closeBtn')
let menuCloseBtn=document.getElementById('menuCloseBtn')
let menuBtn=document.getElementById('menuBtn')
let mobNavBrand=document.getElementById('mobNavBrand')
let mobSideBar=document.getElementById('mobSideBar')
let path=location.pathname
let splitPath=path.split("/")
let proPath=path.split("-")
let scrolled=false
let shopBtns=document.getElementsByClassName('shop-btn')
let moreBtns=document.getElementsByClassName('more-btn')
let moreLinks=document.getElementsByClassName('more-link')
let shopLinks=document.getElementsByClassName('shop-link')
let navHovered=false
let body=document.getElementsByTagName('BODY')[0]
let id = null
let screenL=window.screenLeft
var links = [].slice.call(linksColl);
function menuBtnClicked(){

    menuBtn.style.display='none'
    document.getElementById('mobNavItems').style.display='none'
    mobNavBrand.style.display='none'
    mobSideBar.style.animationName='fade'
    mobSideBar.style.animationDuration='.8s'
    mobSideBar.style.animationTimingFunction='ease-in-out'
    clearInterval(id)
    mobSideBar.style.display='block'
    body.style.overflowY='hidden'
    
    
}
function chatBtnClicked(){
    chatPopup.style.display='block'
    chatBtn.style.display='none'
}
function chatCloseBtnClicked(){
    chatPopup.style.display='none'
    chatBtn.style.display='block'
    
}

function menuCloseBtnCLicked(){
    mobSideBar.style.animationName='unfade'
    mobSideBar.style.animationDuration='.8s'
    mobSideBar.style.animationTimingFunction='ease-in-out'
    id=setInterval(()=>{
        menuBtn.style.display='block'
        mobNavBrand.style.display='block'
        mobSideBar.style.display='none'
        document.getElementById('mobNavItems').style.display='block'
    },800)
    body.style.overflowY='scroll'
    
    
    
}
window.onload=()=>{
    let cartShow=sessionStorage.getItem("showCart")
    if(cartShow){
        showCart()
        sessionStorage.removeItem("showCart")
    }
}



let elm=document.getElementById('navbar')
elm.onmouseover=()=>{
    navHovered=true
    links.forEach((link) => {
        link.style.color='#000'
        
    });
    let elm=document.getElementById('navbar')
    elm.style.backgroundColor='#FFFF'
    
}

elm.onmouseleave=()=>{

    shopOptOut()
    transpOptOut()
    abtOptOut()
    if(location.pathname === '/'){
    
    if(document.body.scrollTop > 40 || document.documentElement.scrollTop >40){
        
        
        links.forEach((link) => {
            link.style.color='black'
            
        });
        elm.style.backgroundColor='#FFFF'
    }else{
        links.forEach((link) => {
            link.style.color='#FFFF'
            
        });
        elm.style.backgroundColor='transparent'

    }
    
}
}
let premCards=document.getElementById('prem-product-cards')
let lightCards=document.getElementById('light-product-cards')
let prevBtn=document.getElementById('prev-btn')
let scrollCard=0
let lightScrollCard=0
function nextBtnClicked(nextBtn,cat){
    if(cat === 'prem'){

        premCards.scrollLeft += 500
        scrollCard=premCards.scrollLeft.toFixed()
        let premNewScroll=premCards.scrollLeft
        let premWidth=premCards.offsetWidth
        let premScrollWidth=premCards.scrollWidth
        let premOffSet=premScrollWidth - premNewScroll -premWidth
        if(premOffSet < 1){
            nextBtn.style.color='#ccc'
        }
    }
    if(cat === 'light'){

        lightCards.scrollLeft += 500
        lightScrollCard=lightCards.scrollLeft.toFixed()
        let newScroll=lightCards.scrollLeft
        let width=lightCards.offsetWidth
        let scrollWidth=lightCards.scrollWidth
        let offSet=scrollWidth - newScroll -width
        if(offSet < 1){
            nextBtn.style.color='#ccc'
        }
    }
    nextBtn.closest('[data-btns]').querySelector('[data-prev-btn]').style.color='#000'
}
function prevBtnClicked(prevBtn,cat){
    if(cat === 'prem'){

        premCards.scrollLeft -= 500
        scrollCard=premCards.scrollLeft.toFixed()
        if(scrollCard<500){
            prevBtn.style.color='#ccc'
            
        }
    }
    if(cat === 'light')
    lightCards.scrollLeft -= 500
    lightScrollCard=lightCards.scrollLeft.toFixed()
    if(lightScrollCard<500){
        prevBtn.style.color='#ccc'
        
    }
    prevBtn.closest('[data-btns]').querySelector('[data-next-btn]').style.color='#000'

    
    
}
let colln=document.getElementById('collections')
let heroCntnt=document.getElementById('hero-content')
if (location.pathname === '/') {
    mobNav.style.backgroundColor='transparent'
    navbar.style.backgroundColor='transparent'
        links.forEach((link) => {
            link.style.color='#FFFF'
            
        })               
}
if(proPath.indexOf('/product') >  -1){
document.getElementById('pro-images').focus()
document.getElementById('returnPolicy').style.display='block'
mobNav.style.top='50px'
mobNav.style.background='transparent'
navbar.style.top='40px'
let proImages=document.getElementById('pro-images')
var x = window.matchMedia("(max-width: 991px)")
proImages.addEventListener('scroll',(e)=>{
    if(proImages.scrollTop === 1445){
        proImages.blur()

    }
})
if(x.matches){
    links.forEach((link) => {
        link.style.color='#FFFF'
    })               
}
}

let xscrolled
let scrollTop=document.documentElement.scrollTop
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}
let proImgSeen=false

window.onscroll=()=>{
    if(splitPath.indexOf('admin') ===  -1){
        var x = window.matchMedia("(max-width: 991px)")
    scrollTop=document.documentElement.scrollTop
     if(proPath.indexOf('/product') >  -1){

      proImgSeen= isInViewport(document.getElementById('products'))    
    if(proImgSeen){
            document.getElementById('pro-images').focus()
         }   
    }
    if(location.pathname === '/'){

        if(document.body.scrollTop > 750 || document.documentElement.scrollTop >750){
            
            let herDIv=document.getElementById('hero')
            if(!x.matches){
                herDIv.style.position='relative'
            }
            
        }else{
            if(!x.matches){
                
                document.getElementById('hero').style.position='fixed'
            }
            
        }
        
    }
    
    
    if(document.body.scrollTop > 40 || document.documentElement.scrollTop >40){
        scrolled=true
        
        navbar.style.backgroundColor='#FFFF'
        mobNav.style.backgroundColor='#FFFF'
        if(proPath.indexOf('/product') >  -1 && x.matches){
            
            document.getElementsByClassName('sticky-btn')[0].style.display='block'
        }
        mobNav.style.paddingTop='.5em'
        links.forEach((link) => {
            
            link.style.color='#000'
            
        });
    }else{
        if(optionsHovered){
        if(!optionsHovered.status){

            scrolled=false
        
        if(location.pathname === '/'){
            navbar.style.backgroundColor='transparent'
            mobNav.style.backgroundColor='transparent'
            mobNav.style.paddingTop='0'
            links.forEach((link) => {
                link.style.color='#FFFF'
                
            })
        }
        if(proPath.indexOf('/product') >  -1 && x.matches){
                navbar.style.backgroundColor='#FFFF'
                mobNav.style.backgroundColor='transparent'
                mobNav.style.paddingTop='0'
                links.forEach((link) => {
                    link.style.color='#FFFF'
                    
                })
                
        }
    }else{
          navbar.style.backgroundColor='#FFFF'
          mobNav.style.paddingTop='0'
          links.forEach((link) => {
                link.style.color='black'
                    
          })
    }

    if(proPath.indexOf('/product') > -1){
            document.getElementsByClassName('sticky-btn')[0].style.display='none'
        }
     }
   }
 }
}  



