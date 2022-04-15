const userList = document.querySelector('.userList');

export function renderUserList(arrUser) {
  const markupList = arrUser
    .map((user, index) => {
      return `<li style=" display: flex";>
      <p style="font-size: 24px">${user[0]}</p>
      <p style="font-size: 24px">${user[1].admin}</p>
      <input class='radioButton' type='radio' name='admin' id='${user[0]}' />
      </li>`;
    })
    .join('');
  userList.innerHTML = markupList;
}
