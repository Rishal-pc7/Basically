let optionsHovered={
    status:false,
    elm:null
}






async function shopBtnHover(elm){
   
    elm.style.border='2px solid #FFFF'
    elm.style.transition='.5s ease-in-out'
    elm.style.backgroundColor='transparent'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='#FFFF'
    
} 
async function shopBtnOut(elm){
    elm.style.border='none'
    elm.style.backgroundColor='#FFFF'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='black'

}
async function moreBtnHover(elm){
    
    elm.style.border='none'
    elm.style.backgroundColor='#FFFF'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='black'
    elm.style.transition='.5s ease-in-out'
}
async function moreBtnOut(elm){
    elm.style.border='2px solid #FFFF'
    elm.style.backgroundColor='transparent'
    let a=elm.getElementsByTagName('a')[0]
    a.style.color='#FFFF'
}
let shopOpt=document.getElementById('shopOpt')
let transpOpt=document.getElementById('transpOpt')
let abtOpt=document.getElementById('abtOpt')
let myTimeout

async function shopOptHover(elm){
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
async function shopOptOut(){
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
async function transpOptHover(elm){
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
async function transpOptOut(){
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
async function abtOptHover(elm){
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
async function abtOptOut(){
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
async function productOut(cat){
    const activeImg=document.querySelector('[data-img-active]')
    initialImg.dataset.imgActive=true
    delete activeImg.dataset.imgActive
}
async function productHovered(cat){
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
async function changeActiveOption(elm){
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
async function showFooterOpts(elm){
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
async function hideFooterOpts(elm){
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
async function changeDetailsOptions(elm){
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
async function showMoreBasicallies(elm){
    xscrolled=true
   document.getElementById('basic-prev-btn').style.display='block'
   document.getElementById('grid-items').scrollLeft +=500
}
async function showLessBasicallies(elm){
    xscrolled=true
    let gridItems=document.getElementById('grid-items')
    gridItems.scrollLeft -=500
    let scrollLeft=gridItems.scrollLeft.toFixed()
    if(scrollLeft < 500){
        document.getElementById('basic-prev-btn').style.display='none'
        
    }
}
async function showOrderSummary(elm){
    elm.style.display='none'
    let hideBtn=document.getElementById('hideOrderSummary')
    let orderSummary=document.getElementById('orderSummary')
    hideBtn.style.display='block'
    orderSummary.style.display='block'

}
async function hideOrderSummary(elm){
    elm.style.display='none'
    let showBtn=document.getElementById('showOrderSummary')
    let orderSummary=document.getElementById('orderSummary')
    showBtn.style.display='block'
    orderSummary.style.display='none'

}
async function showCart(){
    let path=location.pathname
    let proPath=path.split("-")
    
    document.getElementById('cart').style.display='block'
    body.style.overflow='hidden'
    mobNav.style.zIndex='1'
    
    !function(f,b,e,v,n,t,s){
        if(f.fbq)
        return;
        n=f.fbq=function(){
          n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', '172181538913764');
         fbq('track', 'AddToCart');
         
    if(location.pathname === '/'){ 

        document.getElementById('hero-content').style.zIndex='0'
    }
    if(proPath.indexOf('/product')> -1){
        document.getElementsByClassName('sticky-btn')[0].style.position='relative'

    } 
}
async function hideCart(){
    document.getElementById('cart').style.display='none'
    body.style.overflow='auto'
    mobNav.style.zIndex='99'
    if(location.pathname === '/'){

        document.getElementById('hero-content').style.zIndex='none'
    }
}
async function changeAcntsOpts(elm){
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