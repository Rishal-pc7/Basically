let optionsHovered={
    status:false,
    elm:null
}






function shopBtnHover(elm){
   
    elm.style.border='2px solid #FFFF'
    elm.style.transition='.5s ease-in-out'
    elm.style.backgroundColor='transparent'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='#FFFF'
    
} 
function shopBtnOut(elm){
    elm.style.border='none'
    elm.style.backgroundColor='#FFFF'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='black'

}
function moreBtnHover(elm){
    
    elm.style.border='none'
    elm.style.backgroundColor='#FFFF'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='black'
    elm.style.transition='.5s ease-in-out'
}
function moreBtnOut(elm){
    elm.style.border='2px solid #FFFF'
    elm.style.backgroundColor='transparent'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='#FFFF'
}
let shopOpt=document.getElementById('shopOpt')
let transpOpt=document.getElementById('transpOpt')
let abtOpt=document.getElementById('abtOpt')
let myTimeout

function shopOptHover(elm){
            transpOptOut()
            abtOptOut()
            navbar.style.height='35em'
            optionsHovered.status=true
            optionsHovered.elm='shop'
            elm.style.backgroundColor='black'
            elm.style.border='1px solid black'
            elm.style.borderRadius='25px'
            elm.style.padding='5px 25px'
            elm.style.marginTop='-5px'
            elm.getElementsByTagName('a')[0].classList.remove('links')
            elm.getElementsByTagName('a')[0].classList.add('white-link')
            if(navbar.style.height === '35em'){
               document.getElementById('shopOpts').style.display='grid'
                
            }
            
    
     
}
function shopOptOut(){
    document.getElementById('shopOpts').style.display='none'
    let elm=shopOpt
    optionsHovered.status=false
    optionsHovered.elm=null
    elm.style.backgroundColor='transparent'
    elm.style.border='none'
    elm.style.borderRadius='0'
    elm.style.marginTop='0'
    elm.style.padding='0'
    elm.getElementsByTagName('a')[0].style.color='black'
    elm.getElementsByTagName('a')[0].classList.add('links')
    elm.getElementsByTagName('a')[0].classList.remove('white-link')
    navbar.style.height='5em'
       
}; 
function transpOptHover(elm){
    shopOptOut()
    abtOptOut()
    optionsHovered.status=true
    optionsHovered.elm='transp'
    elm.getElementsByTagName('a')[0].style.color='#FFFF'
    elm.style.backgroundColor='black'
    elm.style.border='1px solid black'
    elm.style.borderRadius='25px'
    elm.style.padding='5px 25px'
    elm.getElementsByTagName('a')[0].classList.remove('links')
    elm.getElementsByTagName('a')[0].classList.add('white-link')
    elm.style.marginTop='-5px'
    navbar.style.height='35em'
    document.getElementById('shopOpts').style.display='none'
    document.getElementById('abtOpts').style.display='none'
    if(navbar.style.height === '35em'){
        document.getElementById('transpOpts').style.display='grid'
         
     }
}
function transpOptOut(){
    document.getElementById('transpOpts').style.display='none'
    let elm=transpOpt
    optionsHovered.status=false
    optionsHovered.elm=null
    elm.style.backgroundColor='transparent'
    elm.style.border='none'
    elm.style.borderRadius='0'
    elm.style.marginTop='0'
    elm.style.padding='0'
    elm.getElementsByTagName('a')[0].classList.add('links')
    elm.getElementsByTagName('a')[0].classList.remove('white-link')
    navbar.style.height='5em'
    
}
function abtOptHover(elm){
    transpOptOut()
    shopOptOut()
    optionsHovered.status=true
    optionsHovered.elm='about'
    elm.getElementsByTagName('a')[0].style.color='#FFFF'
    elm.style.backgroundColor='black'
    elm.style.border='1px solid black'
    elm.style.borderRadius='25px'
    elm.style.padding='5px 25px'
    elm.getElementsByTagName('a')[0].classList.remove('links')
    elm.getElementsByTagName('a')[0].classList.add('white-link')
    elm.style.marginTop='-5px'
    navbar.style.height='35em'
    if(navbar.style.height === '35em'){
        document.getElementById('abtOpts').style.display='grid'
    }
}
function abtOptOut(){
    let elm=abtOpt
    document.getElementById('abtOpts').style.display='none'
    optionsHovered.status=false
    optionsHovered.elm=null
    elm.style.backgroundColor='transparent'
    elm.style.border='none'
    elm.style.borderRadius='0'
    elm.style.marginTop='0'
    elm.style.padding='0'
    elm.getElementsByTagName('a')[0].classList.add('links')
    elm.getElementsByTagName('a')[0].classList.remove('white-link')
    navbar.style.height='5em'
    
}
let initialImg=document.getElementById('initialImg')
let ltwtImg=document.getElementById('ltwtImg')
let prmImg=document.getElementById('prmImg')
function productOut(cat){
    const activeImg=document.querySelector('[data-img-active]')
    initialImg.dataset.imgActive=true
    delete activeImg.dataset.imgActive
}
function productHovered(cat){
    const activeImg=document.querySelector('[data-img-active]')
    if(cat === 'prmweight'){
        prmImg.dataset.imgActive=true
        delete activeImg.dataset.imgActive
    }
    else if(cat === 'lightweight'){
        ltwtImg.dataset.imgActive=true
        delete activeImg.dataset.imgActive
    }
    
      
    
}
function changeActiveOption(elm){
    console.log(elm.id)
    let id=elm.id
    let activeClass=document.getElementsByClassName('active')[0]
    let activeOptsClass=document.getElementsByClassName('activeOpts')[0]
    activeClass.classList.remove('active')
    activeOptsClass.classList.remove('activeOpts')
    if(id === 'shopMobOpt'){
        document.getElementById('shopMobOpts').classList.add('activeOpts')
    }
    if(id === 'transMobOpt'){
        document.getElementById('transpMobOpts').classList.add('activeOpts')
    }
    else if(id === 'abtMobOpt'){
        document.getElementById('abtMobOpts').classList.add('activeOpts')
    }
    elm.classList.add('active')
 
}
function showFooterOpts(elm){
    elm.style.display='none'
    let footerHt=document.getElementById('footer-div').clientHeight
    if(elm.id === 'policyShowBtn'){
        document.getElementById('footer-div').style.height = footerHt+80+'px'
        document.getElementById('policyHideBtn').style.display='block'
        document.getElementById('policyOpts').style.display='block'
    }
    if(elm.id === 'helpShowBtn'){
        document.getElementById('footer-div').style.height = footerHt+52+'px'
        document.getElementById('helpHideBtn').style.display='block'
        document.getElementById('helpOpts').style.display='block'
    }
    if(elm.id === 'abtShowBtn'){
        document.getElementById('footer-div').style.height = footerHt+2+'px'
        document.getElementById('abtHideBtn').style.display='block'
        document.getElementById('aboutOpts').style.display='block'
    }
}
function hideFooterOpts(elm){
    elm.style.display='none'
    let footerHt=document.getElementById('footer-div').clientHeight
    console.log(footerHt);
    if(elm.id === 'policyHideBtn'){
        document.getElementById('footer-div').style.height = footerHt-280+'px'
        document.getElementById('policyShowBtn').style.display='block'
        document.getElementById('policyOpts').style.display='none'
    }
    if(elm.id === 'helpHideBtn'){
        document.getElementById('footer-div').style.height = footerHt-252+'px'
        document.getElementById('helpShowBtn').style.display='block'
        document.getElementById('helpOpts').style.display='none'
    }
    if(elm.id === 'abtHideBtn'){
        document.getElementById('footer-div').style.height = footerHt-202+'px'
        document.getElementById('abtShowBtn').style.display='block'
        document.getElementById('aboutOpts').style.display='none'
    }
}
function changeDetailsOptions(elm){
    console.log(elm);
    let activeDetails=document.getElementsByClassName('activeDetails')
    let activeDetailsOptions=document.getElementsByClassName('activeDetailsOptions')
    activeDetails[0].classList.replace('activeDetails','.')
    elm.className += ' activeDetails'
    if(elm.id === 'description'){
        activeDetailsOptions[0].classList.replace('activeDetailsOptions','.')
        document.getElementById('descriptionsDiv').className += ' activeDetailsOptions'
    }
    if(elm.id === 'details'){
        activeDetailsOptions[0].classList.replace('activeDetailsOptions','.')
        document.getElementById('detailsDiv').className += ' activeDetailsOptions'
    }
    if(elm.id === 'size'){
        activeDetailsOptions[0].classList.replace('activeDetailsOptions','.')
        document.getElementById('sizeDiv').className += ' activeDetailsOptions' 
    }
}
function showMoreBasicallies(elm){
    xscrolled=true
   document.getElementById('basic-prev-btn').style.display='block'
   document.getElementById('grid-items').scrollLeft +=500
}
function showLessBasicallies(elm){
    xscrolled=true
    let gridItems=document.getElementById('grid-items')
    gridItems.scrollLeft -=500
    let scrollLeft=gridItems.scrollLeft.toFixed()
    if(scrollLeft < 500){
        document.getElementById('basic-prev-btn').style.display='none'
        
    }
}
function showOrderSummary(elm){
    elm.style.display='none'
    let hideBtn=document.getElementById('hideOrderSummary')
    let orderSummary=document.getElementById('orderSummary')
    hideBtn.style.display='block'
    orderSummary.style.display='block'

}
function hideOrderSummary(elm){
    elm.style.display='none'
    let showBtn=document.getElementById('showOrderSummary')
    let orderSummary=document.getElementById('orderSummary')
    showBtn.style.display='block'
    orderSummary.style.display='none'

}
function showCart(){
    document.getElementById('cart').style.display='block'
    document.getElementById('chat-wid').style.display='none'
    body.style.overflow='hidden'
    mobNav.style.zIndex='1'
    document.getElementById('hero-content').style.zIndex='0'
    
}
function hideCart(){
    document.getElementById('cart').style.display='none'
    document.getElementById('chat-wid').style.display='block'
    body.style.overflow='auto'
    mobNav.style.zIndex='99'
    document.getElementById('hero-content').style.zIndex='2'
}
function changeAcntsOpts(elm){
    let activeAcnts=document.getElementsByClassName('activeAcnts')
    let activeAcntsOpts=document.getElementsByClassName('activeAcntsOpts')
    activeAcnts[0].classList.replace('activeAcnts','.')
    elm.className += ' activeAcnts'
    if(elm.id === 'acntsDetail'){
        activeAcntsOpts[0].classList.replace('activeAcntsOpts','.')
        document.getElementById('detailsDiv').className += ' activeAcntsOpts'
    }
    if(elm.id === 'acntsOrder'){
        activeAcntsOpts[0].classList.replace('activeAcntsOpts','.')
        document.getElementById('ordersDiv').className += ' activeAcntsOpts'
    }
    if(elm.id === 'acntsOut'){
        activeAcntsOpts[0].classList.replace('activeAcntsOpts','.')
        document.getElementById('logoutDiv').className += ' activeAcntsOpts'
    }

    
}