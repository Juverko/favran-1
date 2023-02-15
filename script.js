async function start(){
  slider('.favor-product .slider','.favor-product .next','.favor-product .prev',460);
  await fetch(`https://favran-client-service-backend.000webhostapp.com/v1/categories`).then(async data=>{
    let categories = await data.json();
    categories = categories.response;
    // console.log(categories);
    let ul = document.createElement('ul');
    ul.classList.add('menu');
    categories.forEach(categ=>{
      ul.innerHTML+=`<li>
        <a data-id="${categ.slug}">${categ.name}</a>
      </li>`;
    })
    document.querySelector('.burger').appendChild(ul);
    let moreCategory = document.createElement("div");
    moreCategory.classList.add("more-category");
    ul.childNodes.forEach(a=>{
      a = a.children[0];
      a.addEventListener("mouseover",function(){
        let ul = document.createElement("ul");
        console.log(this);
        categories.forEach(categ=>{
          if(categ.slug==this.getAttribute("data-id")){
            ul.innerHTML+=`
            <li>
              <a data-id="${categ.slug}">${categ.name}1</a>
              <a data-id="${categ.slug}">${categ.name}1</a>
              <a data-id="${categ.slug}">${categ.name}1</a>
            </li>
            <li>
              <a>${categ.name}2</a>
              <a>${categ.name}2</a>
            </li>
            <li><a>${categ.name}3</a></li>
            <li>
              <a>${categ.name}4</a>
              <a>${categ.name}4</a>
              <a>${categ.name}4</a>
            </li>`;
          }
        })
        moreCategory.innerHTML='';
        moreCategory.appendChild(ul);
      })
    })
    document.querySelector('.burger').appendChild(moreCategory);
    document.querySelector(".category-burger").addEventListener("click",async function(e){
      e.preventDefault();
      document.querySelector('.burger #close').addEventListener("click",function(ee){
        ee.preventDefault();
        document.querySelector('.burger').style.left ="-100%";
      })
      document.querySelector('.burger').style.left = 0;
    })
  })
}




async function createBlocks(fetchURL,header,parentBlock){
  let blocks = document.createElement('div');
  blocks.classList.add('category-block');
  blocks.innerHTML = `
  <div class="category-header">
    <p>${header}</p>
  </div>
  <div class="slider"> 
    <a href="" class="buttons prev"><</a>
    <a href="" class="buttons next">></a>
    <div class="products">
      
    </div>
  </div>
  
  `;
  let res = await fetch(fetchURL).then(async res=>{
    console.log(res.status);
    if(res.status!=200){
      alert("УУУУПС а вот и пиздец!!!");
      window.location='';
    }
    return await res.json()
  });
  res.response.forEach(product => {
    console.log(product);
    let block = document.createElement("div");
    block.classList.add('product');
    block.innerHTML=`
      
    `;
    blocks.children[1].children[2].innerHTML+=`
      <div class='product'>
        <div class="discont">35%</div>
        <img src="${product.image}" alt="">
        <div class="prod-name">${product.name}</div>
        <div class="coast">
          <div class="prod-coast">${product.price}TJS</div>
          <div class="prod-old-coast">${product.price}TJS</div>
        </div>
        <div class="prod-market">Магазин: Корвон</div>
        <a href="" class="buy">заказать</a>
      </div>
      
    `
  });
  
  parentBlock.appendChild(blocks);
  slider('.footer .slider .products','.footer .next','.footer .prev',220,true);
}

async function salom(){
  let res = await fetch(`https://favran-client-service-backend.000webhostapp.com/v1/categories`).then(async res=>{
    return await res.json();
  })
  console.log(res);
  res.response.forEach(banner=>{
    // console.log(banner);
    document.querySelector('.categoryList').innerHTML+=`<div>
      <img data-close='1' data-id="${banner.slug}" data-name="${banner.name}" src="${banner.image}">
      <div class="category" id="category">
    </div>
      </div>`;
  })
  document.querySelectorAll(".categoryList img").forEach(img=>[
    img.addEventListener("click",function(){
      document.querySelector('.content .category').innerHTML = '';
      let endPoint = 'products';
      // endPoint = this.getAttribute('data-id');
      console.log(this.parentElement.children[1]);
      this.setAttribute('data-close',Number(this.getAttribute('data-close'))+1);
      if(Number(this.getAttribute('data-close'))%2==0){
        createBlocks(`https://favran-client-service-backend.000webhostapp.com/v1/${endPoint}`,this.getAttribute('data-name'),this.parentElement.children[1]).then(res=>{
        slider('.content .category .slider .products','.content .category .next','.content .category .prev',220,true);
        // window.location="#category";
      })
      }else{
        this.parentElement.children[1].innerHTML = ``;
      }
    })
  ])
}

salom();

createBlocks(`https://favran-client-service-backend.000webhostapp.com/v1/products`,'Топ продукты',document.querySelector('.footer'));

function slider(slider,next,prev,sliderSch,bool){
  let slCh = 0;
  let ch = 0;
  sliderSch = (document.querySelector(slider).children[0].offsetLeft*2)+document.querySelector(slider).children[0].offsetWidth;
  if((document.querySelector(slider).children.length*sliderSch>window.screen.width && bool) || !bool){
    let st = setInterval(()=>{
      if(slCh>=document.querySelector(slider).children.length-2 && !bool){
        clearInterval(st);
        slCh=document.querySelector(slider).children.length-2;
      }else if(bool && ch>=document.querySelector(slider).children.length*sliderSch-window.screen.width){ 
        clearInterval(st);
      }else{
        ch+=sliderSch;
        slCh++;
        document.querySelector(slider).style.transform = `translateX(-${ch}px)`;
      }
    },4000)
    document.querySelector(prev).addEventListener("click",function(e){
      e.preventDefault();
      ch-=sliderSch;
      slCh--;
      if(ch<=0){
        ch=0;
        slCh=0;
      }
      console.log(ch);
      document.querySelector(slider).style.transform = `translateX(-${ch}px)`;
    })
    document.querySelector(next).addEventListener("click",function(e){
      e.preventDefault();
      if(slCh>=document.querySelector(slider).children.length-2 && !bool){
        slCh = document.querySelector(slider).children.length-2;
      }else if(bool && ch>=document.querySelector(slider).children.length*sliderSch-window.screen.width){
        return false;
      }else{
        ch+=sliderSch;
        // console.log(ch);
        document.querySelector(slider).style.transform = `translateX(-${ch}px)`;
        slCh++;
      }
    })

  }
  

  

  
}
start();


