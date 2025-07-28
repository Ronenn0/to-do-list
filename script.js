
let filter = 0; // current filter 0, 1, 2
let todoList = [];
const filterButtons = document.querySelectorAll('.filters button');

/**
 * A class that helps maintain the tasks.
 */
class ToDo {
    name;
    isCompleted;
    id;
    constructor(toDoDetails) {
        this.name = toDoDetails.name;
        this.isCompleted = toDoDetails.isCompleted;
        this.id = crypto.randomUUID();
    }

    /**
     * 
     * @param {*} name -> task name
     * Adds a task to the todoList and updates local storage.
     * - by checking that it doesn't exist at first.
     */
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

    /**
     * Updates the todoList parameter in local storage.
     */
    static updateStorage() {
        localStorage.setItem('todolist', JSON.stringify(todoList));
    }

    /**
     * Marks the task as completed and updates local storage
     */
    complete() {
        this.isCompleted = !this.isCompleted;
        ToDo.updateStorage();
    }

    /**
     * Deletes task and updates local storage
     */
    delete() {
        const index = todoList.findIndex(todo => todo.name.toLowerCase() === this.name.toLowerCase());

        if (index !== -1) {
            todoList.splice(index, 1);
        }
        ToDo.updateStorage();
    }
    /**
     * 
     * @param {number} id -> id for Li Element 
     * @returns the Li with the specific Id
     */
    static findByLiId(id) {
        return todoList.find(task => task.id === id);
    }
}

/**
 * 
 * Loads the todoList from localStorage.
 * if doesn't exist it saves it as an empty array.
 * - todoList param is declared as [] as default.
 */
function loadToDoList() {
    if (!localStorage.getItem('todolist')) {
        localStorage.setItem('todolist', JSON.stringify([]));
        return;
    }
    todoList = JSON.parse(localStorage.getItem('todolist')).map(todo => new ToDo(todo));
}

/**
 * 
 * @param {HTMLButtonElement} btn -> the complete button that was pressed.
 * Marks a task as complete and updates the UI.
 */
function completeTask(btn) {
    const id = btn.parentElement.parentElement.dataset.id;
    ToDo.findByLiId(id).complete();
    displayList();
}

/**
 * 
 * @param {HTMLButtonElement} btn -> the delete button that was pressed.
 * Deletes a task and updates the UI.
 */
function deleteTask(btn) {
    const id = btn.parentElement.parentElement.dataset.id;
    ToDo.findByLiId(id).delete();
    displayList();
}

/**
 * 
 * @param {number} filter -> highlighted filter button's index
 * it highlights the button.
 */
function highlightFilter(filter) {
    filterButtons.forEach((button, index) => {
        if (filter == index) addClass(button, 'picked');
        else removeClass(button, 'picked');
    });
}

/**
 * 
 * @param {*} element 
 * @param {string} className 
 * adds the class className to the element
 */
function addClass(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
}

/**
 * 
 * @param {*} element 
 * @param {string} className 
 * removes the class className from the element
 */
function removeClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

/**
 * 
 * @param {number} filter -> determines what filter is currently on
 * values:
 *  0: no filters. (Default value)
 *  1: show only activated (uncompleted) tasks.
 *  2: show only completed tasks.
 * 
 *  The function displays a list of tasks with or without filter inside the ul#todo-list Element.
 */
function displayList() {
    const todoListContainer = document.querySelector('#todo-list');
    let HTML = '';
    todoList.forEach(todo => {

        highlightFilter(filter);
        // Filters what tasks get to be shown.
        if (filter == 1) {
            if (todo.isCompleted) return;
        } else if (filter == 2) {
            if (!todo.isCompleted) return;
        }

        const completedClassName = (todo.isCompleted && filter != 2) ? 'completed' : '';
        const buttonsState = {
            complete: todo.isCompleted ? 'hidden' : '',
            activate: todo.isCompleted ? '' : 'hidden'
        };

        HTML += `
        <li data-id="${todo.id}">
                <span class="task-name ${completedClassName}">${todo.name}</span>
                <div class="updaters">
                <button class="complete ${buttonsState.complete}" onclick="completeTask(this)">Complete ✓</button>
                <button class="uncomplete ${buttonsState.activate}" onclick="completeTask(this)">Activate 🔘</button>
                <button class="delete" onclick="deleteTask(this)" >Delete 🗑️</button>
                </div>
            </li>
        `;
    });

    todoListContainer.innerHTML = HTML;
};

/**
 * 1. prevents the page from reloading when form submitted
 * 2. Adds tasks that the user inputted (if valid)
 */
function addFormEventListener() {
    const todoInput = document.querySelector('#todo-input');
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

/**
 * filters tasks when buttons(filters) are clicked.
 */
function addFilterEventListeners() {
    filterButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            filter = index;
            displayList();
        });
    });
}

loadToDoList();
displayList();
addFormEventListener();
addFilterEventListeners();