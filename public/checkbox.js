let socket = io();
const checkboxes = 100

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

async function getData() {
  const url = "http://localhost:3000/api/checkboxes";
  //try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched checkboxes:', result);
    for(let i=0; i<result.data.length; i++){
      for(let j=0; j<result.data[i].length; j++){
        isChecked = result.data[i][j];
        if(isChecked === '') 
          continue;
        checkboxNum = result.data[i][j];
        let currBox=document.getElementById(checkboxNum);
        currBox.checked = true;//data.checked;

      }
    }

  // } catch (error) {
  //   console.error(error.message);
  // }
}

getData();

socket.on('fromServer', (data) => {
    console.log(data);
    const checkbox = document.getElementById(data.id);
    checkbox.checked = data.checked;
});

