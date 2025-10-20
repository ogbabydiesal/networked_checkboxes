let socket = io();
const checkboxes = 1000

const checkboxForm = document.querySelector('#checkboxForm');

for (let i = 0; i < checkboxes; i++) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `myCheckbox${i}`;
  checkbox.name = 'myCheckbox';
  checkboxForm.appendChild(checkbox);
}

checkboxForm.addEventListener('change', (event) => {
    if (event.target.name === 'myCheckbox') {
        const c = event.target.checked;
        const data = { id: event.target.id, checked: c };
        socket.emit("checkedState", data);
    }
    
  });

socket.on('broadcastState', (data) => {
    console.log(data);
    const checkbox = document.getElementById(data.id);
    checkbox.checked = data.checked;
});