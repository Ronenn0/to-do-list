

class ToDo {
    name;
    isCompleted;
    id;
    constructor(toDoDetails) {
        this.name = toDoDetails.name;
        this.isCompleted = toDoDetails.isCompleted;
        this.id = crypto.randomUUID();
    }
    static add(name) {
        if (todoList.some(todo => todo.name.trim().toLowerCase() === name.trim().toLowerCase())) {
            alert('This task already exists');
            return;
        }
        todoList.push(new ToDo({
            name: name,
            isCompleted: false
        }));
        ToDo.updateStorage();
    }
    static updateStorage() {
        localStorage.setItem('todolist', JSON.stringify(todoList));
    }
    complete() {
        this.isCompleted = !this.isCompleted;
        ToDo.updateStorage();
    }
    delete() {
        const index = todoList.findIndex(todo => todo.name.toLowerCase() === this.name.toLowerCase());
        console.log(index);

        if (index !== -1) {
            todoList.splice(index, 1);
        }
        ToDo.updateStorage();
    }
    static findByLiId(id) {
        return todoList.find(task => task.id === id);
    }
}
/*
[{
    name: 'Create a ...',
    isCompleted: false
}]
*/
let todoList = [];

function loadToDoList() {
    if (!localStorage.getItem('todolist')) {
        localStorage.setItem('todolist', JSON.stringify([]));
        return;
    }
    todoList = JSON.parse(localStorage.getItem('todolist')).map(todo => new ToDo(todo));
}

function completeTask(btn) {
    const id = btn.parentElement.dataset.id;
    ToDo.findByLiId(id).complete();
    displayList();
}
function deleteTask(btn) {
    const id = btn.parentElement.dataset.id;
    ToDo.findByLiId(id).delete();
    displayList();
}

function displayList() {
    const todoListContainer = document.querySelector('#todo-list');
    let HTML = '';
    todoList.forEach(todo => {
        let completedClassName = '';
        let hiddenOrNot = '';
        let uncompleteButtonClassName = '';
        let completeButtonValue = 'Complete ✓';
        if (todo.isCompleted) {
            completedClassName = 'completed';
            uncompleteButtonClassName = 'uncomplete';
            completeButtonValue = 'Uncomplete ✖';
            hiddenOrNot = 'hidden';
        }
        HTML += `
        <li data-id="${todo.id}">
            <span class="task-name ${completedClassName}">${todo.name}</span>
            <input type="button" value="${completeButtonValue}" class="complete ${uncompleteButtonClassName}" onclick="completeTask(this)">
            <input type="button" value="Delete 🗑️" class="delete" onclick="deleteTask(this)">
        </li>
        `;
    });

    todoListContainer.innerHTML = HTML;
};

function addButtonEventListener() {
    const todoInput = document.querySelector('#todo-input');
    const addBtn = document.querySelector('.add-todo');
    const form = document.querySelector('#todo-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = todoInput.value.trim();
        if (input.length == 0) return;
        ToDo.add(input);
        todoInput.value = ''; // ✅ clear input
        displayList();
    });
}
loadToDoList();
displayList();
addButtonEventListener();