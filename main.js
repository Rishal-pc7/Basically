let navbar =document.getElementById('navbar')
let mobNav =document.getElementById('mob-nav')
let content =document.getElementById('content')
let txtContent =document.getElementById('txtContent')
let links=document.getElementsByClassName('links')
let chatBtn=document.getElementById('chatBtn')
let chatPopup=document.getElementById('chatPopup')
let closeBtn=document.getElementById('closeBtn')
let menuCloseBtn=document.getElementById('menuCloseBtn')
let menuBtn=document.getElementById('menuBtn')
let mobNavBrand=document.getElementById('mobNavBrand')
let mobSideBar=document.getElementById('mobSideBar')
let mobBalanceBar=document.getElementById('mobBalanceBar')


let body=document.getElementsByTagName('BODY')[0]
let id = null
let screenL=window.screenLeft
chatBtn.addEventListener('click',()=>{
    chatPopup.style.display='block'
    chatBtn.style.display='none'
})
closeBtn.addEventListener('click',()=>{
    chatPopup.style.display='none'
    chatBtn.style.display='block'
    
})
menuBtn.addEventListener('click',()=>{
    menuBtn.style.display='none'
  mobNavBrand.style.display='none'
  mobSideBar.style.animationName='fade'
  mobSideBar.style.animationDuration='.8s'
  mobSideBar.style.animationTimingFunction='ease-in-out'
  clearInterval(id)
  mobSideBar.style.display='block'
  mobBalanceBar.style.display='block'
  body.style.overflowY='hidden'
  
  
})
menuCloseBtn.addEventListener('click',()=>{
    mobSideBar.style.animationName='unfade'
    mobSideBar.style.animationDuration='.8s'
    mobSideBar.style.animationTimingFunction='ease-in-out'
    id=setInterval(()=>{
        menuBtn.style.display='block'
        mobNavBrand.style.display='block'
        mobSideBar.style.display='none'
    },800)
    body.style.overflowY='scroll'
    mobBalanceBar.style.display='none'
    
    
    
})
mobBalanceBar.addEventListener('click',()=>{
    mobSideBar.style.animationName='unfade'
    mobSideBar.style.animationDuration='.8s'
    mobSideBar.style.animationTimingFunction='ease-in-out'
    id=setInterval(()=>{
        menuBtn.style.display='block'
        mobNavBrand.style.display='block'
        mobSideBar.style.display='none'
    },800)
    body.style.overflowY='scroll'
    mobBalanceBar.style.display='none'
    
    
})




window.onscroll=(e)=>{
    console.log(screenL)
    if(document.body.scrollTop > 100 || document.documentElement.scrollTop >100){
        navbar.style.backgroundColor='#FFFF'
        navbar.style.paddingTop='.5em'
        mobNav.style.backgroundColor='#FFFF'
        mobNav.style.paddingTop='.5em'
        for(i in links){
            links[i].style.color='#000'
        }
    }else{
        navbar.style.backgroundColor='transparent'
        navbar.style.paddingTop='0'
        mobNav.style.backgroundColor='transparent'
        mobNav.style.paddingTop='0'
        for(i in links){
            links[i].style.color='#FFFF'
        }
        
    }
}