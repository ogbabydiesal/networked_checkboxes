let socket = io();
const checkboxes = 1000

const checkboxForm = document.querySelector('#checkboxForm');

for (let i = 0; i < checkboxes; i++) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `${i}`;
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

console.log("before starting data");
getStartingData();

async function getStartingData() {
  console.log("trying to start reading the get");
  const url = "http://localhost:3000/api/checkboxes";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let result = await response.json();
    console.log('Fetched checkboxes from backend database:', result['states']);
    result=result['states'];
    for(let i=0; i<result['states'].length; i++){
        checkboxNum = i;
        isChecked = result.states[i];
        let currBox=document.getElementById(checkboxNum);
        currBox.checked = isChecked;
    }

  } catch (error) {
    console.error(error.message);
  }
}



socket.on('fromServer', (data) => {
    console.log(data);
    const checkbox = document.getElementById(data.id);
    checkbox.checked = data.checked;
});

