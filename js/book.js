function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = await axios.get('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (e) {
    console.log('getUserByToken error', e);
    return null;
  }
}
async function getBook(bookId) {
  const token = getToken();
  if (token === null) {
    location.assign('/login.html');
    return null;
  }
  try {
    const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data;
  } catch (e) {
    console.log('getBook error', e);
    return null;
  }
}
async function logout() {
  const token = getToken();
  if (token === null) {
    location.assign('/login.html');
    return;
  }
  try {
    await axios.delete('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log('logout error', error);
  } finally {
    localStorage.clear();
    location.assign('/login.html');
  }
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}
async function deleteBook(bookId) {
  const token = getToken();
  if (token === null) {
    location = '/login';
    return;
  }
  await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
function render(book){
  const detailElement = document.querySelector('#detail');

  detailElement.innerHTML = `<div class="card bg-light w-100">
    <div class="card-header"><h4>${book.title}</h4></div>
    <div class="card-body">
      <h5 class="card-title">"${book.message}"</h5>
      <p class="card-text">글쓴이 : ${book.author}</p>
      <p class="card-text">링크 : <a href="${
        book.url
      }" target="_BLANK">바로 가기</a></p>
      <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
      <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
    </div>
    <div class="card-footer">
        <small class="text-muted">작성일 : ${new Date(
          book.createdAt,
        ).toLocaleString()}</small>
      </div>
  </div>`;

  document.querySelector('#btn-delete').addEventListener('click', async () => {
    try {
      await deleteBook(book.bookId);
      location.href = '/';
    } catch (error) {
      console.log(error);
    }
  });
}

async function main() {
  // 버튼이벤트
  bindLogoutButton();
  //브라우저에서 id 가져오기
  const bookId = new URL(location.href).searchParams.get('id');
  //토큰체크
  const token = getToken();
  if (token === null) {
    location.assign('/login.html');
    return;
  }
  //토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login.html');
    return;
  }
  //책을 서버에서 받아오기
  const book = await getBook(bookId);
  if (book === null) {
    alert('서버에서 책을 불러오기가 실패하였습니다.')
    return;
  }
  //받아온 책을 그리기
  render(book);
}

document.addEventListener('DOMContentLoaded', main);