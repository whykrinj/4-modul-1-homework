const API_URL = 'https://674b201871933a4e88547ec0.mockapi.io/api/v1/contacts';

async function fetchContacts() {
  const response = await fetch(API_URL);
  const contacts = await response.json();

  const contactsList = document.getElementById('contacts-list');
  contactsList.innerHTML = '';

  contacts.reverse().forEach(contact => {
    const contactElement = document.createElement('div');
    contactElement.className = 'flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition';

    contactElement.innerHTML = `
      <div class="flex items-center gap-4">
        <!-- Фото пользователя -->
        <img src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg" alt="User Avatar" class="w-16 h-16 rounded-full">
        <div>
          <p class="font-bold text-lg text-gray-800">${contact.name}</p>
          <p class="text-gray-500">${contact.number || 'undefined'}</p>
        </div>
      </div>
      <div class="flex gap-4">
        <button class="edit-btn text-blue-500 hover:underline" data-id="${contact.id}">Edit</button>
        <button class="delete-btn text-red-500 hover:underline" data-id="${contact.id}">Delete</button>
      </div>
    `;
    contactsList.appendChild(contactElement);
  });

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => editContact(button.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => deleteContact(button.dataset.id));
  });
}

async function addContact() {
  const name = document.getElementById('name-input').value;
  const number = document.getElementById('number-input').value;

  if (!name || !number) {
    alert('Please fill in both fields.');
    return;
  }

  const newContact = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, number }),
  });

  document.getElementById('name-input').value = '';
  document.getElementById('number-input').value = '';

  fetchContacts(); 
}

async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchContacts();
}

async function editContact(id) {
  const newName = prompt('Enter new name:');
  const newNumber = prompt('Enter new number:');

  if (!newName || !newNumber) {
    alert('Both fields are required.');
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName, number: newNumber }),
  });

  fetchContacts(); 
}

document.getElementById('add-contact-btn').addEventListener('click', addContact);

fetchContacts();
