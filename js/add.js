

function getToken(){
  return localStorage.getItem('token');
}

async function getUserByToken(token){
  try{
    const res = await axios.get('https://api.marktube.tv/v1/me',{
      headers:{
        Authorization: `Bearer ${token}` 
      }
    });
    return res.data;
  }catch(e){
    console.log('getUserByToken error', e);
    return null;
  }
}

async function save(e){
  e.preventDefault();
  e.stopPropagation();
  console.log('save');
  e.target.classList.add('was-validated');
  const titleEl = document.querySelector('#title');
  const messageEl = document.querySelector('#message');
  const authorEl = document.querySelector('#author');
  const urlEl = document.querySelector('#url');

  const title = titleEl.value;
  const message = messageEl.value;
  const author = authorEl.value;
  const url = urlEl.value;

  if( title === '' || message === '' || author === '' ||  url === ''){
    return;
  }
  const token = getToken();

  if(token === null){
    location.assign('/login.html');
    return;
  }

  try{
    await axios.post('https://api.marktube.tv/v1/book',{
      title,
      message,
      author,
      url
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    location.assign('/');
  }catch(e){
    console.log('save Error', error);
    alert('추가 실패');
  }
  
}

function bindSaveButton(){
  const form = document.querySelector('#form-add-book');
  form.addEventListener('submit', save);
}

async function main(){
  //버튼에 이번테 연결
  bindSaveButton();
  //토큰체크용
  const token = getToken();

  if(token === null){
    location.assign('/login.html');
    return;
  }
  //토큰으로서버에서 나의 정보 받기
  const user = await getUserByToken(token);
  if(user === null){
    localStorage.clear();
    location.assign('/login.html');
    return;
  }
}
document.addEventListener('DOMContentLoaded',main);