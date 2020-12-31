// 選取DOM
const selectArea = document.querySelector('#selectAreaId');
const popularArea = document.querySelector('#popularAreaId');
const tripListInfo = document.querySelector('#tripInfoId');
const pageBtnGroup = document.querySelector('#paginationId');
let tripData = '';
let filterData = [];
let perpage = 8;
const xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true)
xhr.send(null);
xhr.onload = function(){
  // 將AJAX回傳資料轉換成 array 格式
  let data = JSON.parse(xhr.responseText).result.records;
  tripData = data
  catchZone();
  initial();
}

//自動撈取資料庫Zone資訊，對應 select選單項目
function catchZone (){
  //取得所有 Zone array
  let allZone = [];
  for(let i = 0; i < tripData.length; i++){
    allZone.push(tripData[i].Zone);
  }
  //過濾重複的Zone資料
  let zoneList = [];
  allZone.forEach(function(value){
    if(zoneList.indexOf(value)== -1){
      zoneList.push(value);
    }
  })
  // 將過濾完的Zone array 使用innerHTML 顯示在 select option
  let str = '';
  let defaultSelect = '<option value="" disabled selected>- - 請選擇行政區 - -</option>'
  for(let i = 0; i < zoneList.length; i++){
    str += `<option value="${zoneList[i]}">- - ${zoneList[i]} - -</option>`  
  }
  selectArea.innerHTML = defaultSelect+str;
}

// 將初始畫面預設為三民區的資料
function initial(){
  filterData = tripData;
  // filterData = []; //讓過濾後資料庫清空 以便下方迴圈重新.push()內容

  // for(let i = 0; i < tripData.length; i++){ 
  //   if(tripData[i].Zone == '三民區'){
  //     // 將filterData 內容為符合篩選條件的資料
  //     filterData.push(tripData[i]);
  //   }
  // }
  inner();
  pagination();
}

// Select 選單
function tripInfo(e){
  let el = e.target.value;
  filterData = []; //讓過濾後資料庫清空 以便下方迴圈重新.push()內容

  for(let i = 0; i < tripData.length; i++){ 
    if(el == tripData[i].Zone){
      // 將filterData 內容為符合篩選條件的資料
      filterData.push(tripData[i]);
      document.querySelector('#zoneTextId').textContent = el;
    }else if(el == ''){return}
  }
  inner();
  pagination();
}
selectArea.addEventListener('change',tripInfo,false)

// 熱門地區
function popularInfo(e){
  if(e.target.nodeName !== 'BUTTON'){return}
  document.querySelector('#zoneTextId').textContent = e.target.textContent;

  filterData = []; //讓過濾後資料庫清空 以便下方迴圈重新.push()內容

  for(let i = 0; i < tripData.length; i++){ 
    if(e.target.textContent == tripData[i].Zone){
      // 將filterData 內容為符合篩選條件的資料
      filterData.push(tripData[i]);
    }
  }
  inner();
  pagination();
}
popularArea.addEventListener('click',popularInfo,false)

function inner(){
  let str = '';
  perpage = 8; //再次賦予perpage=8 否則會機率性報錯
  if(perpage > filterData.length){
    perpage = filterData.length;
  }
  for(let i = 0; i < perpage; i++){
    str += `
    <div class="col-sm-6">
      <div class="card">
        <div class="card-header" style="background: url('${filterData[i].Picture1}'); background-position: center center; background-size: cover;">
          <h4>${filterData[i].Name}</h4>
          <h5>${filterData[i].Zone}</h5>
        </div>
        <div class="card-body">
          <ul>
              <li><img src="img/icons_clock.png">${filterData[i].Opentime}</li>
              <li><img src="img/icons_pin.png">${filterData[i].Add}</li>
              <li><img src="img/icons_phone.png">${filterData[i].Tel}</li>
              <li class="text-right"><img src="img/icons_tag.png">${filterData[i].Ticketinfo}</li>
          </ul>
        </div>
      </div>
    </div>`
  }
  tripListInfo.innerHTML = str;
}

// 初始分頁功能
function pagination(){
  // 跟隨已過濾後(select/popular/initial)的資料庫長度
  let dataLen = filterData.length;
  let totalPage = Math.ceil(dataLen/perpage);
  let str= '';
  
  for(let i=0; i<totalPage; i++){
    str += `<button>${i+1}</button>`
  }
  // 當頁數只有1頁時 不顯示分頁按鈕
  if(totalPage == 1){
    str = '';
  }
  pageBtnGroup.innerHTML = str;
  //當分頁按鈕INNER後 增添active Class 標記第一頁當前所在頁面
  if(totalPage > 1){
    document.querySelector('#paginationId button').setAttribute('class','active')
  }
}

// 分頁按鈕功能
function pageSwitch(e){
  if(e.target.nodeName !== 'BUTTON'){return}
  let str = '';
  let min = (e.target.textContent)*perpage - perpage;
  let max = (e.target.textContent)*perpage;

  if(max > filterData.length){ 
    max = filterData.length 
  }
  for(let i=min; i<max; i++){
    str += `
    <div class="col-sm-6">
      <div class="card">
        <div class="card-header" style="background: url('${filterData[i].Picture1}'); background-position: center center; background-size: cover;">
          <h4>${filterData[i].Name}</h4>
          <h5>${filterData[i].Zone}</h5>
        </div>
        <div class="card-body">
          <ul>
            <li><img src="img/icons_clock.png">${filterData[i].Opentime}</li>
            <li><img src="img/icons_pin.png">${filterData[i].Add}</li>
            <li><img src="img/icons_phone.png">${filterData[i].Tel}</li>
            <li class="text-right"><img src="img/icons_tag.png">${filterData[i].Ticketinfo}</li>
          </ul>
        </div>
      </div>
    </div>` 
  }
  tripListInfo.innerHTML = str;
}
pageBtnGroup.addEventListener('click',pageSwitch,false)

// 向上捲動功能
$(document).ready(function () {  
  $('.scroll-top') .click( function( ){
    $(' html , body ') .animate({
      scrollTop : 0 
    }, 350 );
  });
  // 必須使用監聽語法
  $('html').on('click','.pagination button',function(){
      $(this).addClass('active').siblings().removeClass('active');
  });
});