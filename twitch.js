const displayTitle = document.querySelector('.display__title');
const moreResultsBtn = document.querySelector('.display__moreResultsBtn');
const results = document.querySelector('.row');
const lis = document.querySelector('.navbar__topGames').children;
const container = document.querySelector('#streams');
const resultWidth = 300;
const state = {};
const pages = [];
let after = 0;
let lastSearchedText = '';




window.addEventListener('scroll', function(e){
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.offsetHeight;
  if(scrollTop + windowHeight + 1 >= documentHeight){
    state.isBottom = true;
  } else {
    state.isBottom = false;
  }
})


Object.defineProperty(state, 'isBottom', {
  get: function(){
    return isBottom;
  },
  set: function(value){
    isBottom = value;
    if(!isBottom) return;
    addStreams();
  }
})



function initStreams(){
  let queryString = '?language=zh';
  getStreams(queryString, function(streams){
      streams.find(stream => { queryString += '&id=' + stream.user_id/* + `&after=${after*20}`*/})
      getUsers(queryString, function(users){
          streams.find(stream => {
            users.find(user => {
              if(stream.user_id === user.id){
                  stream.profile_image_url = user.profile_image_url
                  stream.offline_image_url = user.offline_image_url
              }
            })
          })
        showStreamResult(streams);
      });
  });
}

function addStreams(){
    let queryString = `?after=${pages[pages.length - 1]}`;
    getStreams(queryString, function(streams){
      streams.find(stream => { queryString += '&id=' + stream.user_id})
      getUsers(queryString, function(users){
        streams.find(stream => {
          users.find(user => {
            if(stream.user_id === user.id){
                stream.profile_image_url = user.profile_image_url
                stream.offline_image_url = user.offline_image_url
            }
          })
        })
      showStreamResult(streams);
      document.documentElement.scrollTop=0;
      });
    });
}


function showTopFiveGames(arr, callback) {
    const navbarTopGames = document.querySelector('.navbar__topGames').children;
    for (let i = 0; i < arr.length; i += 1) {
      navbarTopGames[i + 1].innerText = `${arr[i]}`;
    }
    callback();
}


function getStreams(queryString, callback){
    const api = 'https://api.twitch.tv/helix/streams';
    const clientID = 'qidrkm1b2nf0nq8mpatr6sf4coduv7';
    const Token = '7a66oe3pm5ga52k57qiylj4457g1rg';
    const request = new XMLHttpRequest();
    request.open('GET', api + queryString, true);
    request.setRequestHeader('Authorization', 'Bearer ' + Token);
    request.setRequestHeader('Client-Id', clientID);
    request.send();
    request.onload = function(e){
        try {
            JSON.parse(request.response);
          } catch (err) {
            console.log(err);
          }
      const results = JSON.parse(request.response).data;
      const page = JSON.parse(request.response).pagination.cursor;
      console.log(page);
      pages.push(page);
      console.log(results);
      callback(results);
    }
}
  
function getUsers(queryString, callback){
    const api = 'https://api.twitch.tv/helix/users';
    const clientID = 'qidrkm1b2nf0nq8mpatr6sf4coduv7';
    const Token = '7a66oe3pm5ga52k57qiylj4457g1rg';
    const request = new XMLHttpRequest();
    request.open('GET', api + queryString, true);
    request.setRequestHeader('Authorization', 'Bearer ' + Token);
    request.setRequestHeader('Client-Id', clientID);
    request.send();
    request.onload = function(e){
        try {
            JSON.parse(request.response);
          } catch (err) {
            console.log(err);
          }
        const results = JSON.parse(request.response).data;
        console.log(results);
        callback(results);
    }
}


function getTopFiveGames(callback) {
    const api = 'https://api.twitch.tv/helix';
    const clientID = 'qidrkm1b2nf0nq8mpatr6sf4coduv7';
    const Token = '7a66oe3pm5ga52k57qiylj4457g1rg'; 
    const request = new XMLHttpRequest();
    request.open('GET', `${api}/games/top?first=5`, true);
    request.setRequestHeader('Client-ID', clientID);
    request.setRequestHeader('Authorization', 'Bearer ' + Token);
    request.send();
    request.onload = () => {
        const topFiveGames = [];
        try {
          JSON.parse(request.response);
        } catch (err) {
          console.log(err);
        }
        const gameData = JSON.parse(request.response).data;
        console.log(gameData);
        for (let i = 0; i < gameData.length; i += 1) {
          topFiveGames.push(gameData[i].name);
        }
        console.log(topFiveGames);
        callback(topFiveGames, getStreams);
    };
}
  
  function getGameName(name, callback) {
    const api = 'https://api.twitch.tv/helix';
    const clientID = 'qidrkm1b2nf0nq8mpatr6sf4coduv7';
    const Token = '7a66oe3pm5ga52k57qiylj4457g1rg'; 
    const request = new XMLHttpRequest();
    const searchQuery = encodeURI(name);
    request.open('GET', `${api}/search/channels?query=${searchQuery}`, true);
    request.setRequestHeader('Client-ID', clientID);
    request.setRequestHeader('Authorization', 'Bearer ' + Token);
    request.send();
    request.onload = () => {
        try {
          JSON.parse(request.response);
        } catch (err) {
          console.log(err);
        }
        const searchResult = JSON.parse(request.response);
        console.log(searchResult);
        if (!searchResult.games) {
          results.innerHTML = '';
          moreResultsBtn.classList.add('hide');
          displayTitle.innerText = `These are live streams of "${document.querySelector('.navbar__search__text').value}"`;
          return;
        }
        callback(searchResult.games[0].name);
    };
}
  
getTopFiveGames(showTopFiveGames);


document.querySelector('form').addEventListener('submit', (e) => {
    after = 0;
    for (let i = 0; i < lis.length; i += 1) {
      lis[i].classList.remove('active');
    }
    getGameName(document.querySelector('.navbar__search__text').value, getStreams);
    e.preventDefault();
});
  
document.querySelector('.navbar__topGames').addEventListener('click', (e) => {
    after = 0;
    for (let i = 0; i < lis.length; i += 1) {
      lis[i].classList.remove('active');
    }
    e.target.classList.add('active');
    let gameName;
    if (e.target.id === 'popularStreams') {
      gameName = '';
    } else {
      gameName = e.target.innerText;
    }
    getGameName(gameName, showStreamResult);
});

document.querySelector('.display__moreResultsBtn').addEventListener('click', () => {
    after += 1;
    initStreams(lastSearchedText, showStreamResult);
});

function showStreamResult(streams) {
  console.log(streams);
  if (after === 0) {
    results.innerHTML = '';
  }
  const w = resultWidth;
  const h = Math.floor(w / 16 * 9);
  for (const stream of Object.values(streams)) {
    let previewImgUrl = stream.thumbnail_url;
    previewImgUrl = `${previewImgUrl.slice(0, previewImgUrl.indexOf('{'))}${w}x${h}.jpg`;
    const templateHTML = ` <div class="display_results">
      <div class="preview">
        <img src="${previewImgUrl}" onload="this.style.opacity=1"/>
      </div>
          <div class="intro">
              <div class="logo">
                  <img src="${stream.profile_image_url}"/>
              </div>
              <div class="dicriptions">
                  <div class="title">
                      ${stream.title}
                  </div>
                  <div class="name">
                      ${stream.user_name}
                  </div>
              </div>
          </div>
  </div>
    `;
    const newResult = document.createElement('div');
    newResult.setAttribute('onclick', `window.open('https://www.twitch.tv/${stream.user_login}','_blank');`);
    newResult.classList.add('display__result');
    newResult.innerHTML = templateHTML;
    results.appendChild(newResult);
  }
  if (streams.length < 20) {
    moreResultsBtn.classList.add('hide');
  } else {
    moreResultsBtn.classList.remove('hide');
  }
  let shownsearchText;
  if (lastSearchedText) {
    shownsearchText = lastSearchedText;
  } else {
    shownsearchText = 'Most Popular';
  }
  const templateMessage = `These are live streams of "${shownsearchText}"`;
  displayTitle.innerText = templateMessage;
}


initStreams((err, data) => {
  const {streams} = data;
  const $row = $('.row');
  for(let stream of streams) {
      $row.append(showStreamResult(stream));
  }
});