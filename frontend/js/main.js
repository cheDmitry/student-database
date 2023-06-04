(() => {

  const appContainer = document.querySelector('.app-container');
  let searchTimeoutId = null;
  let sortStatus = {type: 'id', reverse: false}
  let clientsArray = [];

  const contactInput = {
    phone: `<input type="tell" placeholder="Введите данные контакта" class="form-control contact__input contact__input-phone"></input>`, 
    email: `<input type="email" placeholder="Введите данные контакта" class="form-control contact__input contact__input-email">`,
    facebook: `<input type="text" placeholder="Введите данные контакта" class="form-control contact__input contact__input-facebook">`,
    vk: `<input type="text" placeholder="Введите данные контакта" class="form-control contact__input contact__input-vk">`,
    other: `
      <input type="text" placeholder="Тип" class="form-control contact__input contact__input-other-type">
      <input type="text" placeholder="Данные" class="form-control contact__input contact__input-other-value">
    `
  }

  if (new URL(window.location).searchParams.get('id')) {
    let url = new URL(window.location);
    let clientsIdArray = url.searchParams.getAll('id');
    const container = document.createElement('div');
    container.classList.add('container', 'client-card-container');

    container.append(createClientCardsForm());
    
    appContainer.append(container);

    createClientsCards(clientsIdArray); 
    
    return
  }

  createHeader();
  createMain();

  
  //Создаём хиддер
  function createHeader() {
    const header = document.createElement('header');
    const headerContainer = document.createElement('div');

    header.classList.add('header');
    headerContainer.classList.add('header-container', 'container', 'd-flex');

    headerContainer.insertAdjacentHTML('beforeend', createHeaderDesc()) //I

    headerContainer.querySelector('.header__form').addEventListener('input', () => {
      clearTimeout(searchTimeoutId);
      searchTimeoutId = setTimeout(createOptions, 300);
    }); //II
    headerContainer.querySelector('.header__form').addEventListener('submit', (e) => {
      e.preventDefault();
      focusSearchElement(document.querySelector('.header__select option:checked').value); //III
    }); 

    header.append(headerContainer);
    appContainer.append(header);
  }

  function createMain() {
    const main = document.createElement('main');
    const mainContainer = document.createElement('div');
    const mainTitle = document.createElement('h2');
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    main.classList.add('main');
    mainContainer.classList.add('main__container', 'container');
    mainTitle.classList.add('main__title', 'title');
    table.classList.add('table')
    tableBody.classList.add('table__body');

    mainTitle.textContent = 'Клиента'

    table.append(createTableHead());
    table.append(tableBody);

    mainContainer.append(mainTitle);
    mainContainer.append(table);
    mainContainer.append(createMainButton()); //IV

    main.append(mainContainer);

    appContainer.append(main);

    createTableBody(); //V
  }

  function createHeaderDesc() {
    return `
      <a href="#" class="header__logo">
      <img src="./img/header-logo.svg" alt="лого скиллбас">
      </a>

      <form class="header__form">
      <select class="header__select" data-select name="select" id="header-select">
        <div class="select-container"></div>
      </select>
      </form>

      <div class="spiner header__spiner display-no"></div>
    `
  }

  async function createOptions() {
    document.querySelector('.header__spiner').classList.remove('display-no');

    const clientsSearchValue = document.querySelector('.header__form input').value
    const clients = await fetch(`http://localhost:3000/api/clients?search=${clientsSearchValue}`);
    const clientsArray = await clients.json();

    document.querySelectorAll('.header__select option').forEach( (e) => {
      e.remove();
    });

    document.querySelector('.header__select').insertAdjacentHTML('beforeend', '<option value=" "></option>'); //МБ без пробела в ковычках

    clientsArray.forEach( (e) => {
      document.querySelector('.header__select').insertAdjacentHTML('beforeend', createOption(e));
    });

    document.querySelector('.header__spiner').classList.add('display-no');

    document.querySelectorAll('.select__dropdown [role="option"]').forEach( (e) => {
      e.addEventListener('click', (i) => { 
          focusSearchElement(document.querySelector('.header__select option:checked').value)
      });
    })

  }

  //Фокусируемся на нужном контакте
  function focusSearchElement(clientId) {
    document.getElementById(`${clientId}`).focus();
  }

  function createTableHead() {
    const tableHead = document.createElement('thead');
    tableHead.classList.add('table__head');

    tableHead.insertAdjacentHTML('beforeend', `
    <th class="table__head__cell table__head__cell-sort table__head-id sort-active" data-sort="id">
      ID

      <svg class="table__head__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6.99662L10.2944 6.29222L7.50177 9.08459L7.4966 2.9996L6.4966 3.00045L6.50177 9.08544L3.7094 6.29281L3 7.00342L7.0034 11L11 6.99662Z" fill="#9873FF"/>
      </svg>
    </th>

    <th class="table__head__cell table__head__cell-sort table__head-name" data-sort="name">
      Фамилия Имя Отчество

      <svg class="table__head__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6.99662L10.2944 6.29222L7.50177 9.08459L7.4966 2.9996L6.4966 3.00045L6.50177 9.08544L3.7094 6.29281L3 7.00342L7.0034 11L11 6.99662Z" fill="#9873FF"/>
      </svg>

      <span class="table__head__span">
        А-Я
      </span>
    </th>

    <th class="table__head__cell table__head__cell-sort table__head-create" data-sort="create">
      Дата и время создания

      <svg class="table__head__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6.99662L10.2944 6.29222L7.50177 9.08459L7.4966 2.9996L6.4966 3.00045L6.50177 9.08544L3.7094 6.29281L3 7.00342L7.0034 11L11 6.99662Z" fill="#9873FF"/>
      </svg>
    </th>

    <th class="table__head__cell table__head__cell-sort table__head-change" data-sort="change">
      Последние изменения

      <svg class="table__head__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6.99662L10.2944 6.29222L7.50177 9.08459L7.4966 2.9996L6.4966 3.00045L6.50177 9.08544L3.7094 6.29281L3 7.00342L7.0034 11L11 6.99662Z" fill="#9873FF"/>
      </svg>
    </th>

    <th class="table__head__cell table__head-contacts" data-sort="contacts">
      Контакты
    </th>

    <th class="table__head__cell table__head-actions" data-sort="actions">
      Действия
    </th> 
    `);

    tableHead.querySelectorAll('.table__head__cell-sort').forEach( (e) => {
      e.addEventListener('click', setSortStatus); //VIII
    });

    return tableHead;
  }

  
  //V
  //Создаём тело таблицы
  async function createTableBody() {
    
    const tableBody = document.createElement('tbody');
    tableBody.classList.add('table__body');

    document.querySelector('.table__body').remove();

    tableBody.insertAdjacentHTML('beforeend', createTableSpiner()); //IX

    document.querySelector('.table').append(tableBody);

    const clients = await fetch('http://localhost:3000/api/clients');
    let clientsArray = await clients.json();

    sortStatus.type = document.querySelector('.sort-active').dataset.sort;

    sortArray(clientsArray);

    
    document.querySelector('.spiner-row').remove();
    
    clientsArray.forEach( (e) => {
      document.querySelector('.table__body').append(createTableRow(e));
    })
    
    // new SimpleBar(document.querySelector('.table__body'))
    SimpleScrollbar.initEl(document.querySelector('.table__body'));
  }

  //VI
  //Создаём кнопку добавления клиента
  function createMainButton() {
    const mainButton = document.createElement('button');

    mainButton.classList.add('button', 'main__button', 'd-flex');
    
    mainButton.insertAdjacentHTML('beforeend', `
      <svg class="main__button__svg" width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/>
      </svg>
      Добавить клиента     
    `);

    mainButton.addEventListener('click', createClientAddModal);

    return mainButton
  }


  //VII
  //Создаём элемент для автодополнения поиска
  function createOption(client) {
    return `
    <option value="${client.id}">
      ${getFullname(client)}
    </option>
    `
  }

  //VIII
  //Определяем параметры сортировки
  function setSortStatus(e) {
    const sortData = e.currentTarget.dataset.sort;

    if (sortData === sortStatus.type) {
      sortStatus.reverse = !sortStatus.reverse
    } else {
      sortStatus.type = sortData;
      sortStatus.reverse = false;
    }

    setTableHeadClass(); //XIV
    createTableBody();
  }

  //IX
  //Создаём спинер таблицы
  function createTableSpiner() {
    return `
    <tr class="spiner-row">
      <td>
        <div class="spiner table__spiner"></div>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
  }

  //X
  //Сортируем массив клиентов
  function sortArray(originArray) {
    const sortingArray = {
      ['id']: () => originArray.sort(sortId), //XV
      ['name']: () => originArray.sort(sortFullname), //XVI
      ['create']: () => originArray.sort(sortCreateDate), //XVII
      ['change']: () => originArray.sort(sortChangeDate), //XIIV
    }

    sortingArray[sortStatus.type]();
  }

  //XI
  //Создаём строку таблицы
  function createTableRow(rowElement) {
    const tableRow = document.createElement('tr');
    tableRow.classList.add('table__row');

    tableRow.append(createIdCell(rowElement)); //XIX
    tableRow.append(createFullnameCell(rowElement)); //XX
    tableRow.append(createDateCreateCell(rowElement)); //XXI
    tableRow.append(createDataChangeCell(rowElement)); //XXII
    tableRow.append(createContactsCell(rowElement)); //XXIII
    tableRow.append(createActionsCell(rowElement)); // XXXIII/1

    tableRow.id = rowElement.id;
    tableRow.tabIndex = 0;

    return tableRow;
  }

  //XII
  //Создаём модальное окно добавления клиента
  function createClientAddModal() {
    const modalAddClientContainer = document.createElement('div');

    modalAddClientContainer.classList.add('modal-container');

    modalAddClientContainer.append(createClientAddModalDesc());

    appContainer.append(modalAddClientContainer);
  }

  //XIII
  //Получаем полное имя клиента
  function getFullname(client) {
    return `${client.surname} ${client.name} ${client.lastName}`;
  }
  

  //XIV 
  //Устанавливаем нужные классы ячейкам головки таблицы
  function setTableHeadClass() {
    document.querySelectorAll('.table__head__cell').forEach( (e) => {
      e.classList.remove('sort-active', 'sort-active--reverse');
    });

    const activeSortCell = document.querySelector(`[data-sort="${sortStatus.type}"]`);

    activeSortCell.classList.add('sort-active');
    if (sortStatus.reverse) {
      activeSortCell.classList.add('sort-active--reverse');
    }
  }
  
  //XV
  //Сортируем по Id
  function sortId(a, b) {
    let firstElement = Number(a.id);
    let secondElement = Number(b.id);

    if (sortStatus.reverse) {
      firstElement = Number(b.id);
      secondElement = Number(a.id);
    }

    return firstElement - secondElement;
  }

  //XVI
  //Сортируем по имени
  function sortFullname(a, b) {
    let firstElement = getFullname(a);
    let secondElement = getFullname(b);

    if (sortStatus.reverse) {
      firstElement = getFullname(b);
      secondElement = getFullname(a);
    }

    if (firstElement > secondElement) {
      return 1;
    } else if (firstElement === secondElement) {
      return 0;
    } else if (firstElement < secondElement) {
      return -1;
    }
  }

  //XVII
  //Сртируем по дате создания
  function sortCreateDate(a, b) {
    let firstElement = new Date (getCorrectDateString(a.createdAt));
    let secondElement = new Date (getCorrectDateString(b.createdAt));

    if (sortStatus.reverse) {
      firstElement = new Date (getCorrectDateString(b.createdAt));
      secondElement = new Date (getCorrectDateString(a.createdAt));
    }

    return firstElement - secondElement;
  }

  //XVIII
  //Сортируем по дате изменения
  function sortChangeDate(a, b) {
    let firstElement = new Date (a.updatedAt);
    let secondElement = new Date (b.updatedAt);
  
    if (sortStatus.reverse) {
      firstElement = new Date (b.updatedAt);
      secondElement = new Date (a.updatedAt);
    }
  
    return firstElement - secondElement;
  }

  //XIX
  //Создаём ячейку с Id
  function createIdCell(client) {
    const idCell = document.createElement('td');

    idCell.classList.add('table__body__cell', 'table__body__cell-id');

    idCell.textContent = client.id;

    return idCell;
  }

  //XX
  //Создаём ячейку с именем
  function createFullnameCell(client) {
    const fullnameCell = document.createElement('td');

    fullnameCell.classList.add('table__body__cell', 'table__body__cell-name');

    fullnameCell.insertAdjacentHTML('beforeend', `
    <a href="index.html?id=${client.id}" class="link client-link">
      ${getFullname(client)}
    </a>
    `);

    return fullnameCell;
  }

  //XXI
  //Создаём ячейку с датой создания
  function createDateCreateCell(client) {
    const dateCreateCell = document.createElement('td');
    
    dateCreateCell.classList.add('table__body__cell', 'table__body__cell-create');

    dateCreateCell.insertAdjacentHTML('beforeend', `
      ${getCorrectDate(client.createdAt).date} <span class ="time-span">${getCorrectDate(client.createdAt).time}</span>
    `);

    return dateCreateCell;
  }

  //XXII
  //Создаём ячейку с датой последнего изменения
  function createDataChangeCell(client) {
    const dateChangeCell = document.createElement('td');

    dateChangeCell.classList.add('table__body__cell', 'table__body__cell-change');

    dateChangeCell.insertAdjacentHTML('beforeend', `
    ${getCorrectDate(client.updatedAt).date} <span class ="time-span">${getCorrectDate(client.updatedAt).time}</span>
    `);

  return dateChangeCell;
  }

  //XXIII
  //Создаём ячейку с контактами
  function createContactsCell(client) {
    const contactsCell = document.createElement('td');
    const contactsContainer = document.createElement('div');

    contactsCell.classList.add('table__body__cell', 'table__body__cell-contacts')
    contactsContainer.classList.add('d-flex')

    client.contacts.forEach( (e) => {
      contactsContainer.append(createContactItem(e));
    })

    contactsCell.append(contactsContainer);

    return contactsCell;
  }

  //XXIII
  //Создаём ячейку с кнопками
  function createActionsCell(client) {
    const actionsCell = document.createElement('td');
    const actionsButtonContainer = document.createElement('div');

    actionsCell.classList.add('table__body__cell', 'table__body__cell-actions');
    actionsButtonContainer.classList.add('table__button-container', 'd-flex');

    actionsButtonContainer.append(createChangeButton(client.id));
    actionsButtonContainer.append(createDelleteButton(client.id));

    actionsCell.append(actionsButtonContainer);
    return actionsCell;
  }

  //XXIV
  //Создаём модальное окно добавления елиента

  function createClientAddModalDesc() {
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const modalTitle = document.createElement('h3');
    
    modal.classList.add('modal-window', 'animate__animated', 'animate__faster', 'animate__fadeIn');
    modalContent.classList.add('modal__content', 'animate__animated', 'animate__fadeInDown');
    modalTitle.classList.add('modal__title', 'modal__title-add-client');

    modalTitle.textContent = 'Новый клиент';

    modalContent.append(modalTitle);
    modalContent.append(createModalCloseButton()); //XXIX
    modalContent.append(createClientAddForm()); //XXX

    modal.append(modalContent);

    return modal;
  }

  function getCorrectDate(originDate) {
    const newDate = new Date(originDate);
    
    const correctDate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }

    const correctTime = {
      hour: 'numeric',
      minute: 'numeric',
    }

    const date = newDate.toLocaleString('ru', correctDate);
    const time = newDate.toLocaleString('ru', correctTime);
    
    return {
      date,
      time,
    }
  }

  //XXVI
  //Создаём элемент контакта
  function createContactItem(contact) {
    const contactItem = document.createElement('span');

    contactItem.classList.add('contact-span');
    contactItem.tabIndex = 0;

    if (contact.type === 'vk') {
      contactItem.insertAdjacentHTML('beforeend', `
      <a href="vk/${contact.value}" target="_blank" tabindex="-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="1.0">
            <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97312 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3196 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
          </g>
        </svg>
      </a>
      `);
    } else if (contact.type === 'facebook') {
      contactItem.insertAdjacentHTML('beforeend', `
      <a href="${contact.value}" target="_blank" tabindex="-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="1.0">
            <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
          </g>
        </svg>
      </a>
      `);
    } else if (contact.type === 'email') {
      contactItem.insertAdjacentHTML('beforeend', `
      <a href="mailto:${contact.value}" tabindex="-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="1.0" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
        </svg> 
      </a>     
      `);
    } else if (contact.type === 'phone') {
      contactItem.insertAdjacentHTML('beforeend', `
      <a href="tel:${contact.value}" tabindex="-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="1.0">
            <circle cx="8" cy="8" r="8" fill="#9873FF"/>
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
          </g>
        </svg>
      </a>      
      `);
    } else {
      contactItem.textContent = contact.type[0];
      contactItem.classList.add('contact-span-other');
    }

    tippy(contactItem, {
      content: `${contact.type}: <b>${contact.value}</b>`,
      duration: [200, 200],
      allowHTML: true,  
    })

    return contactItem;
  }

  //XXVII
  //Создаём кнопку изменения контакта
  function createChangeButton(clientId) {
    const changeButton = document.createElement('button');

    changeButton.classList.add('table__button', 'table__button-change', 'd-flex');

    changeButton.dataset.clientId = clientId;

    changeButton.insertAdjacentHTML('beforeend', `
    <svg class="table__button__svg" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354V3.69354Z" fill="#9873FF"/>
    </svg>       

    Изменить

    <span class="spiner table__button-change__spiner hidden"></span>    
    `);

    changeButton.addEventListener('click', (e) => {
      createClientChangeModal(e.currentTarget);
    });

    return changeButton;
  }

  //XXVIII
  //Создаём кнопку удаления контакта
  function createDelleteButton(clientId) {
    const delleteButton = document.createElement('button');

    delleteButton.classList.add('table__button', 'table__button-dellet', 'd-flex');

    delleteButton.dataset.clientId = clientId;

    delleteButton.insertAdjacentHTML('beforeend', `
    <svg class="table__button__svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
    </svg>       

    Удалить
    `);

    delleteButton.addEventListener('click', (e) => {
      createClientDelleteModal(e.currentTarget.dataset.clientId);
    })

    return delleteButton
  }

  //XXIX
  //Создаём кнопку закрытия модального окна
  function createModalCloseButton() {
    const closeButton = document.createElement('button');

    closeButton.classList.add('button', 'button-close');

    closeButton.insertAdjacentHTML('beforeend', `
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2333 1.73333L15.2666 0.766664L8.49991 7.53336L1.73324 0.766696L0.766576 1.73336L7.53324 8.50003L0.766603 15.2667L1.73327 16.2333L8.49991 9.46669L15.2666 16.2334L16.2332 15.2667L9.46657 8.50003L16.2333 1.73333Z" fill="#B0B0B0"/>
    </svg>
    `);

    closeButton.addEventListener('click', closeModal);

    return closeButton;
  }

  //XXX
  //Создаём форму добавления клиента
  function createClientAddForm() {
    const clientAddForm = document.createElement('form');

    clientAddForm.classList.add('form', 'modal__form', 'modal__form-add-client');

    clientAddForm.insertAdjacentHTML('beforeend', `
    <div class="input-container">
      <input type="text" id="surname" placeholder=" " class="form__input text-input text-input-surname">
      <label class="form__label" for="surname">Фамилия<span>*</span></label>
    </div>

    <div class="input-container">
      <input type="text" id="name" placeholder=" " class="form__input text-input text-input-name">
      <label class="form__label" for="surname">Имя<span>*</span></label>
    </div>

    <div class="input-container">
      <input type="text" id="lastname" placeholder=" " class="form__input text-input text-input-lastname">
      <label class="form__label" for="surname">Отчество</label>
    </div>
    
    <div class="contacts-container d-flex">
      <button class="button add-contact-button">    
        <span class="add-contact-button__span"></span>
        Добавить контакт
      </button>
    </div>

    <div class="form__alert-text"></div>

    <div class="form__button-container d-flex">
      <button type="submit" class="button form__button form__add-client-button form__main-button">
        Сохранить
      </button>

      <button class="button form__button form__cancel-button">
        Отмена
      </button>
    </div>    
    `);

    clientAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
    })
    clientAddForm.querySelector('.add-contact-button').addEventListener('click', () => {
      document.querySelector('.add-contact-button').before(addContact());
      if (!document.querySelector('.contacts-container--fill')) {
        document.querySelector('.contacts-container').classList.add('contacts-container--fill');
      }
    })
    clientAddForm.querySelector('.form__add-client-button').addEventListener('click', addClient);
    clientAddForm.querySelector('.form__cancel-button').addEventListener('click', closeModal);

    clientAddForm.querySelectorAll('.text-input').forEach( (i) => {
      i.addEventListener('input', (e) => {
        e.currentTarget.classList.remove('validation-alert');
      })
    })
    return clientAddForm;
  }

  //XXXI
  //Создаём модальное окно сзименения данных клиента
  async function createClientChangeModal(currentTargetButton) {

    currentTargetButton.querySelector('.spiner').classList.remove('hidden');

    const client = await fetch(`http://localhost:3000/api/clients/${currentTargetButton.dataset.clientId}`);
    const clientElement = await client.json();

    currentTargetButton.querySelector('.spiner').classList.add('hidden');

    const modalChangeClientContainer = document.createElement('div');

    modalChangeClientContainer.classList.add('modal-container');

    modalChangeClientContainer.append(createClientChangeModalDesc(clientElement));

    appContainer.append(modalChangeClientContainer);
  }

  //XXXII
  //Создаём модальное окно удаления клиента
  function createClientDelleteModal(clientId) {
    const modalContainer = document.createElement('div');

    modalContainer.classList.add('modal-container');

    modalContainer.append(createClientDelleteForm(clientId));

    appContainer.append(modalContainer);
  }

  //XXXIII
  //Закрываем модальное окно
  function closeModal() {
    document.querySelector('.modal-window').classList.add('animate__fadeOut');
    setTimeout(() => {document.querySelector('.modal-container').remove()}, 400);
  }

  //XXXIV
  //Добавляем новый контакт
  function addContact(contactType = 'phone') {
    const contact = document.createElement('div');

    contact.classList.add('contact', 'input-group');

    contact.insertAdjacentHTML('beforeend', `
    <select class="contact__select input-group-text" name="" id="">
      <option value="phone" class="contact__option">
        Телефон
      </option>

      <option value="email" class="contact__option">
        Email
      </option>

      <option value="facebook" class="contact__option">
        Facebook
      </option>

      <option value="vk" class="contact__option">
        VK
      </option>

      <option value="other" class="contact__option">
        Другое
      </option>      
    </select>    
    `);

    contact.insertAdjacentHTML('beforeend', contactInput[contactType]);

    contact.insertAdjacentHTML('beforeend', `
    <button class="input-group-text contact__button-dellete">
      <svg width="17" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
      </svg>        
    </button>    
    `);

    const contactSelect = contact.querySelector('.contact__select');
    const choices = new Choices(contactSelect, {
      searchEnabled: false,
      itemSelectText: '',
    });

    choices.setChoiceByValue(`${contactType}`);

    const contactDelleteButton = contact.querySelector('.contact__button-dellete');
    tippy(contactDelleteButton, {
      content: `Удалить контакт`,
      duration: [200, 200],                  
    });

    if (document.querySelectorAll('.contact').length > 8) {
      document.querySelector('.add-contact-button').classList.add('display-no');
    }

    contactSelect.addEventListener('change', (e) => {
      e.currentTarget.closest('.contact').querySelectorAll('.contact__input').forEach( (i) => {i.remove()});
      e.currentTarget.closest('.contact').querySelector('.contact__button-dellete').insertAdjacentHTML('beforebegin', contactInput[e.currentTarget.value])
    });

    contactDelleteButton.addEventListener('click', (e) => {
      e.currentTarget.closest('.contact').remove();
      document.querySelector('.add-contact-button').classList.remove('display-no');
      if (!document.querySelector('.contact')) {
        document.querySelector('.contacts-container').classList.remove('contacts-container--fill');
      }
    })

    contact.querySelectorAll('.contact__input').forEach((e) => {
      e.addEventListener('input', (i) => {
        i.currentTarget.classList.remove('validation-alert');
      })
    })

    return contact;
  }

  //XXXV
  //Добавляем клиента
  async function addClient() {
    const Name = document.querySelector('.text-input-name').value;
    const surname = document.querySelector('.text-input-surname').value;
    const lastName = document.querySelector('.text-input-lastname').value;
    let contactsArray = [];

    const alertText = document.querySelector('.form__alert-text');
    alertText.textContent = '';

    if (!validateForm()) {
      alertText.textContent = 'Пожвлуйста, зполните поля';
      return;
    }

    document.querySelectorAll('.contact').forEach((e) => {
      const contactObject = (createContactObject(e));
      contactsArray.push(contactObject);
    });

    addModalSpiner(); //Классс спинера

    const addClient = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: {'Content-Type': 'application/hson'},
      body: JSON.stringify(
        {
        name: Name,
        surname: surname,
        lastName: lastName,
        contacts: contactsArray,
        })
    });

    const resp = await addClient.json();

    document.querySelector('.modal__spiner-container').remove;

    if (addClient.status >= 200 & addClient.status <= 299) {
      closeModal();
      createTableBody();
    } else if (addClient.status === 422) {
      alertText.textContent = 'Запрос не прошёл валидацию';
    } else {
      alertText.textContent = 'Ой всё!'
    }
  }

  //XXXIIX 
  //Проводим валидацию формы
  function validateForm() {
    let validationStatus = true;

    if (!document.querySelector('.text-input-name').value) {
      validationStatus = false;
      document.querySelector('.text-input-name').classList.add('validation-alert');
    }

    if (!document.querySelector('.text-input-surname').value) {
      validationStatus = false;
      document.querySelector('.text-input-surname').classList.add('validation-alert');
    }

    document.querySelectorAll('.contact__input').forEach((e) => {
      if (!e.value) {
        validationStatus = false;
        e.classList.add('validation-alert');          
      }
    });

    // if (document.querySelector('.'))

    document.querySelectorAll('.modal input').forEach((i) => {
      i.addEventListener('input', (e) => {
        e.currentTarget.classList.remove('validation-alert');
      })
    });
    
    return validationStatus;
  }

  //XXXIX
  //Создаём объект для масства контактов
  function createContactObject(contact) {
    let contactObject = {};
    const contactType = {
      phone: (i) => {
        contactObject.type = 'phone';
        contactObject.value = i.querySelector('.contact__input').value;
      },

      email: (i) => {
        contactObject.type = 'email';
        contactObject.value = i.querySelector('.contact__input').value;
      },

      facebook: (i) => {
        contactObject.type = 'facebook';
        contactObject.value = i.querySelector('.contact__input').value;
      },

      vk: (i) => {
        contactObject.type = 'vk';
        contactObject.value = i.querySelector('.contact__input').value;
      },

      other: (i) => {
        contactObject.type = i.querySelector('.contact__input-other-type').value;
        contactObject.value = i.querySelector('.contact__input-other-value').value;
      }
    }

    contactType[contact.querySelector('option').value](contact);

    return contactObject;
  }

  //XL 
  //Создаём модальное окно изменения данных клиента
  function createClientChangeModalDesc(client) {
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const modalTitle = document.createElement('h3');
    const idSpan = document.createElement('span');
    
    modal.classList.add('modal-window', 'animate__animated', 'animate__faster', 'animate__fadeIn');
    modalContent.classList.add('modal__content', 'animate__animated', 'animate__fadeInDown');
    modalTitle.classList.add('modal__title', 'modal__title-change-client');
    idSpan.classList.add('modal__title__span');

    modalTitle.textContent = 'Изменить данные';
    idSpan.innerHTML = ` ID:&nbsp${client.id}`;

    modalTitle.append(idSpan);
    modalContent.append(modalTitle);
    modalContent.append(createModalCloseButton()); //XXIX
    modalContent.append(createClientChangeForm(client)); //XLII

    modal.append(modalContent);

    return modal;
  }

  //XLI
  //Добавляем спинер модальному окну
  function addModalSpiner() {
    document.querySelector('.modal__content').insertAdjacentHTML('beforeend', `
    <div class="modal__spiner-container">
      <div class="spiner modal-spiner"></div>
    </div>
    `);
  }

  //XLII
  //Создаём форму изменения данных клиента
  function createClientChangeForm(client) {
    const clientChangeForm = document.createElement('form');

    clientChangeForm.classList.add('form', 'modal__form', 'modal__form-change-client');

    clientChangeForm.dataset.clientId = client.id;

    clientChangeForm.insertAdjacentHTML('beforeend', `
    <div class="input-container">
      <input type="text" id="surname" placeholder=" " class="form__input text-input text-input-surname">
      <label class="form__label" for="surname">Фамилия<span>*</span></label>
    </div>

    <div class="input-container">
      <input type="text" id="name" placeholder=" " class="form__input text-input text-input-name">
      <label class="form__label" for="surname">Имя<span>*</span></label>
    </div>

    <div class="input-container">
      <input type="text" id="lastname" placeholder=" " class="form__input text-input text-input-lastname">
      <label class="form__label" for="surname">Отчество</label>
    </div>
    
    <div class="contacts-container d-flex">
      <button class="button add-contact-button">    
        <span class="add-contact-button__span"></span>
        Добавить контакт
      </button>
    </div>

    <div class="form__alert-text"></div>

    <div class="form__button-container d-flex">
      <button type="submit" class="button form__button form__change-client-button form__main-button">
        Сохранить
      </button>

      <button class="button form__button form__cancel-button">
        Удалить клиента
      </button>
    </div>    
    `);

    fillClientForm(client, clientChangeForm); //XLVI
    clientChangeForm.addEventListener('submit', (e) => {
      e.preventDefault();
    })
    clientChangeForm.querySelector('.form__change-client-button').addEventListener('click', () => {
      changeClient(client.id);
    });
    clientChangeForm.querySelector('.form__cancel-button').addEventListener('click', () => {
      delleteClient(client.id);
    });
    
    clientChangeForm.querySelector('.add-contact-button').addEventListener('click', () => {
      document.querySelector('.add-contact-button').before(addContact());
      if (!document.querySelector('.contacts-container--fill')) {
        document.querySelector('.contacts-container').classList.add('contacts-container--fill');
      }
    })

    clientChangeForm.querySelectorAll('.text-input').forEach( (i) => {
      i.addEventListener('input', (e) => {
        e.currentTarget.classList.remove('validation-alert');
      })
    })

    return clientChangeForm;
  }

  //XLIII
  //Создаём модальное окно удаления клиента
  function createClientDelleteForm(clientId) {
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    
    modal.classList.add('modal-window', 'animate__animated', 'animate__faster', 'animate__fadeIn');
    modalContent.classList.add('modal__content-dellete', 'modal__content', 'modal-dellete', 'animate__animated', 'animate__fadeInDown');

    modalContent.insertAdjacentHTML('beforeend', `
    <h3 class="modal__title modal__title-dellete-client">
      Удалить клиента
    </h3>

    <p class="modal__paragraph">
      Вы действительно хотите удалить данного клиента?
    </p>

    <div class="form__alert-text"></div>

    <div class="form__button-container d-flex">
      <button data-client-id="${clientId}" type="submit" class="button form__button form__dellete-client-button form__main-button">
        Удалить
      </button>

      <button class="button form__button form__cancel-button">
        Отмена
      </button>
    </div>
    `); 

    modalContent.append(createModalCloseButton()); //XXIX

    modalContent.querySelector('.form__dellete-client-button').addEventListener('click',  (e) => {
      delleteClient(e.currentTarget.dataset.clientId);
    }); //XLIV
    modalContent.querySelector('.form__cancel-button').addEventListener('click', closeModal);

    modal.append(modalContent);

    return modal;
  }

  //XLIV
  //Удаляем клиента
  async function delleteClient(clientId) {
    addModalSpiner();
    const delleteClient = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: 'DELETE', 
    });

    if (delleteClient.status < 300) {
      closeModal();
      createTableBody();
    } else {
      document.querySelector('.modal__spiner-container').remove();
      document.querySelector('.form__alert-text').textContent = "Ой всё!";
    }
  }

  //XLV
  //Меняем данные клиента
  async function changeClient(clientId) {
    const Name = document.querySelector('.text-input-name').value;
    const surname = document.querySelector('.text-input-surname').value;
    const lastName = document.querySelector('.text-input-lastname').value;
    let contactsArray = [];

    const alertText = document.querySelector('.form__alert-text');
    alertText.textContent = '';

    if (!validateForm()) {
      alertText.textContent = 'Пожвлуйста, зполните поля';
      return;
    }

    document.querySelectorAll('.contact').forEach((e) => {
      const contactObject = (createContactObject(e));
      contactsArray.push(contactObject);
    });

    addModalSpiner(); //Классс спинера

    const addClient = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/hson'},
      body: JSON.stringify(
        {
        name: Name,
        surname: surname,
        lastName: lastName,
        contacts: contactsArray,
        })
    });

    document.querySelector('.modal__spiner-container').remove;

    if (addClient.status >= 200 & addClient.status <= 299) {
      closeModal();
      createTableBody();
    } else if (addClient.status === 422) {
      alertText.textContent = 'Запрос не прошёл валидацию';
    } else {
      alertText.textContent = 'Ой всё!'
    }  
  }

  //XLVI
  //Заполняем форму изменения контакта
  function fillClientForm(client, clientChangeForm) {
    clientChangeForm.querySelector('.text-input-surname').value = client.surname;
    clientChangeForm.querySelector('.text-input-name').value = client.name;
    clientChangeForm.querySelector('.text-input-lastname').value = client.lastName;
    
    let clientContactsArray = client.contacts;
    clientContactsArray.reverse();

    clientContactsArray.forEach((e) => {
      if (e.type === 'phone' || e.type === 'email' || e.type === 'facebook' || e.type === 'vk' ) {
        clientChangeForm.querySelector('.contacts-container').prepend(addContact(e.type));
      } else {
        clientChangeForm.querySelector('.contacts-container').prepend(addContact('other'));
      }
      fillContact(e, clientChangeForm.querySelector('.contacts-container'));
    });
  }

  //Заполняем контакты формы изменения контактов
  function fillContact(contact, contactsContainer) {
    if (contact.type === 'phone' || contact.type === 'email' || contact.type === 'facebook' || contact.type === 'vk' ) {
      contactsContainer.querySelector('.contact__input').value = contact.value;
    } else {
      contactsContainer.querySelector('.contact__input-other-type').value = contact.type;
      contactsContainer.querySelector('.contact__input-other-value').value = contact.value;
    }
  }

  function createClientCardsForm() {
    const form = document.createElement('form');
    currentUrl = new URL(window.location);

    form.classList.add('client-cards-form', 'col-12', 'col-lg-8', 'd-flex');
    form.insertAdjacentHTML('beforeend', `
    <input type="text" placeholder="Введите id клиента" class="client-cards-form__input">

    <button type="" class="client-cards-form__button">
      Добавить карточку
    </button>
    
    <a href="index.html" class="client-card__link-back client-card__link">
      К списку клиентов
    </a>

    <a href="${currentUrl}" class="client-card__link-share client-card__link">
      Поделиться
    </a>    
    `);


    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const input = document.querySelector('.client-cards-form__input');
      const shareLink = document.querySelector('.client-card__link-share');
      
      createClientCard(input.value);

      shareLink.href = shareLink.href + `&id=${input.value}`; 
    })

    return form;
  }

  //Создаём div с карточками клиента
  async function createClientsCards(clientsIdArray) {
    const row = document.createElement('div');
    row.classList.add('cards-container', 'row');
    
    document.querySelector('.client-card-container').append(row);

    clientsIdArray.forEach((e) =>{
      createClientCard(e);
    });

  }

  //Создаём карточку с информацией о клиенте
  async function createClientCard(clientId) {
    const column = document.createElement('div')
    const clientCard = document.createElement('div');
    
    column.classList.add('client-card-column', 'col-12', 'col-md-6', 'col-lg-4', 'd-flex');
    clientCard.classList.add('client-card');

    const client = await fetch(`http://localhost:3000/api/clients/${clientId}`);
    const clientElement = await client.json();

    clientCard.insertAdjacentHTML('beforeend', createClientCardInfo(clientElement));

    clientElement.contacts.forEach( (e) => {
      clientCard.insertAdjacentHTML('beforeend', createClientCardContact(e));
    })

    clientCard.append(createStatusButton());
    ////
    column.append(clientCard);

    document.querySelector('.row').append(column);
  }

  //Заполняем информацию об имени клиента
  function createClientCardInfo(client) {
    return `
    <h3 class="client-card__title">
      ID: ${client.id}
    </h3>

    <p class="client-card__name-paragraph client-card__paragraph">
      <span class="client-card__span">
        Фамилия: 
      </span>
      ${client.surname}
    </p>

    <p class="client-card__name-paragraph client-card__paragraph">
      <span class="client-card__span">
        Имя: 
      </span>
      ${client.name}
    </p>

    <p class="client-card__name-paragraph client-card__paragraph">
      <span class="client-card__span">
        Отчество: 
      </span>
      ${client.lastName}
    </p>

    <h3 class="client-card__contacts-title client-card__title">
      Контакты
    </h3>    
    `;
  }

  //Заполянем информацию о контактных данных клиента
  function createClientCardContact(contact) {
    return `
    <p class="client-card__contact-paragraph client-card__paragraph">
      <span class="client-card__span">
        ${contact.type}: 
      </span>
      ${contact.value}
    </p>        `
  }

  //Добавляем кнопки статуса клиента
  function createStatusButton() {
    const buttonContainer = document.createElement('div');

    buttonContainer.classList.add('status-button-container');

    buttonContainer.insertAdjacentHTML('beforeend', `
    <button class="status-button status-button-green"></button>
  
    <button class="status-button status-button-yellow"></button>

    <button class="status-button status-button-red"></button> 
    `);

    buttonContainer.querySelectorAll('.status-button').forEach( (i) => {
      i.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('status-button--active');
      })
    })

    return buttonContainer;
  }

  //Получаем корректную строку для созания даты 
  function getCorrectDateString(string) {
    return string.replace('T', ' ').substr(0, 16);
  }
})();
