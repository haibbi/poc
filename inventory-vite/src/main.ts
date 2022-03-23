import './style.css'
import {Inventory} from "./inventory";

const app = document.querySelector<HTMLDivElement>('#app')!

const inventory = new Inventory();

const add = (name: string, value: number) => {
    if (name && value) {
        inventory.add({name}, Number(value));
    } else {
        let form = document.querySelector<HTMLFormElement>('#inventory-form')!;
        let entries = Object.fromEntries(new FormData(form).entries());
        inventory.add({name: `${entries.resource}`}, Number(entries.amount));
    }
    refresh();
}

const refresh = () => {
    const list = document.getElementById('list')!;
    list.innerHTML = '';
    inventory.worth().forEach((e) => {
        list.appendChild(createLiEl(e.name, e.amount));
    });
}

const createLiEl = (name: string, amount: number) => {
    const el = document.createElement('li');
    el.id = name;
    el.innerHTML = `
            ${name} x${amount}<br>
            <button onclick="add('${name}', 1)">Add</button>
            <button onclick="remove('${name}', 1)">Remove</button>
            <button onclick="remove('${name}', 10)">Remove x10</button>
        `;
    return el;
}

const remove = (k: string, v: number) => {
    try {
        inventory.remove({name: k}, v);
    } catch (e: any) {
        document.getElementById('error')!.innerText = e.toString();
    } finally {
        refresh();
    }
}


const formHTML = `
<form id="inventory-form">
    <label>
        Resource
        <input name="resource" value="wood" type="text">
    </label>
    <label>
        Amount
        <input name="amount" value="1" type="number">
    </label>
    <button onclick="add()" type="button">Add</button>
</form>
`;

const errorArea = `<div class="error" id="error"></div>`;

const listHTML = `
<ol id="list">
   <li>Inventory</li>
</ol>
`;

app.innerHTML = `
<h1>Inventory</h1>
${formHTML}
${errorArea}
${listHTML}
`

refresh();

// @ts-ignore todo !!!
window.add = add;
// @ts-ignore
window.refresh = refresh;
// @ts-ignore
window.createLiEl = createLiEl;
// @ts-ignore
window.remove = remove;