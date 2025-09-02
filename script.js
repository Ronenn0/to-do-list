
let filter = 0; // current filter 0, 1, 2
let filterByDate = false;
let tasks = [];
const filterButtons = document.querySelectorAll('.filters button');

/**
 * A class that helps maintain the tasks.
 */
class Task {
    name;
    isCompleted;
    id;
    constructor(taskDetails) {
        this.name = taskDetails.name;
        this.date = taskDetails.date;
        this.isCompleted = taskDetails.isCompleted;
        this.id = crypto.randomUUID();
    }

    /**
     * 
     * @param {*} name -> task name
     * Adds a task to the tasks and updates local storage.
     * - by checking that it doesn't exist at first.
     */
    static addTask(name, date) {
        if (tasks.some(task => task.name.trim().toLowerCase() === name.trim().toLowerCase())) {
            message('This task already exists', 3);
            return;
        }
        tasks.push(new Task({
            name: name,
            isCompleted: false,
            date: date
        }));
        Task.saveTasks();
        message('Task has been added successfully!', 2);
    }

    /**
     * Updates the tasks parameter in local storage.
     */
    static saveTasks(tasksList = tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasksList));
    }

    /**
     * Marks the task as completed and updates local storage
     */
    complete() {
        this.isCompleted = !this.isCompleted;
        Task.saveTasks();
        message(this.isCompleted ? 'Task has been marked as completed.' : 'Task has been activated!', 2);
    }

    /**
     * Deletes task and updates local storage
     */
    deleteTask() {
        const index = tasks.findIndex(task => task.name.toLowerCase() === this.name.toLowerCase());

        if (index !== -1) {
            tasks.splice(index, 1);
        }
        Task.saveTasks();
        message('Task has been removed!', 3);
    }
    /**
     * 
     * @param {number} id -> id for Li Element 
     * @returns the Li with the specific Id
     */
    static findByLiId(id) {
        return tasks.find(task => task.id === id);
    }


    /**
     * 
     * @param {HTMLButtonElement} btn -> the complete button that was pressed.
     * Marks a task as complete and updates the UI.
     */
    static completeTask(btn) {
        const id = btn.parentElement.parentElement.dataset.id;
        Task.findByLiId(id).complete();
        renderTasks();
    }

    /**
     * 
     * @param {HTMLButtonElement} btn -> the delete button that was pressed.
     * Deletes a task and updates the UI.
     */
    static deleteTask(btn) {
        const id = btn.parentElement.parentElement.dataset.id;
        Task.findByLiId(id).deleteTask();
        renderTasks();
    }

}

/**
 * 
 * Loads the tasks from localStorage.
 * if doesn't exist it saves it as an empty array.
 * - tasks param is declared as [] as default.
 */
async function getTasks() {
    if (!localStorage.getItem('tasks')) {
        tasks = await fetchInitialTasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return;
    }
    tasks = JSON.parse(localStorage.getItem('tasks')).map(task => new Task(task));
}

/**
 * 
 * @param {number} filter -> highlighted filter button's index
 * the filter is a number and not a whole word - to make it faster O(1) instead of O(n).
 * it highlights the button.
 */
function filterTasks(filter) {
    // if (filter == 'by-date') return;
    filterButtons.forEach((button, index) => {
        if (filter == index) addClass(button, 'picked');
        else removeClass(button, 'picked');
    });
}
/**
 * 
 * @param {Array} tasksList -> array of Tasks
 * @returns a sorted array of tasks sorted by date.
 */
function sortTasks(tasksList) {
    return tasksList.sort((a, b) => new Date(a.date) - new Date(b.date));
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
function renderTasks(filterByDate) {
    const tasksContainer = document.querySelector('#task-list');
    let HTML = '';
    //filters by date and saves the filtered list.
    if (filterByDate) {
        tasks = sortTasks(tasks);
        Task.saveTasks();
    }
    filterTasks(filter);
    tasks.forEach(task => {

        // Filters what tasks get to be shown.
        if (filter == 1) {
            if (task.isCompleted) return;
        } else if (filter == 2) {
            if (!task.isCompleted) return;
        }

        const completedClassName = (task.isCompleted && filter != 2) ? 'completed' : '';
        const buttonsState = {
            complete: task.isCompleted ? 'hidden' : '',
            activate: task.isCompleted ? '' : 'hidden'
        };

        HTML += `
        <li data-id="${task.id}">
                <div class="left-side">
                    <p class="task-date">${task.date.split('-').reverse().join('/')}</p>
                    <textarea class="task-name ${completedClassName}" readonly>${task.name}</textarea>
                </div>
                <div class="updaters">
                <button class="complete ${buttonsState.complete}" onclick="Task.completeTask(this)">Complete ✓</button>
                <button class="uncomplete ${buttonsState.activate}" onclick="Task.completeTask(this)">Activate 🔘</button>
                <button class="delete" onclick="Task.deleteTask(this)" >Delete 🗑️</button>
                </div>
            </li>
        `;
    });
    //no results
    if (HTML == '') {
        tasksContainer.innerHTML = `
        <small>Found no tasks</small>
        `;
    } else tasksContainer.innerHTML = HTML;

};

/**
 * 1. prevents the page from reloading when form submitted
 * 2. Adds tasks that the user inputted (if valid)
 */
function addFormEventListener() {
    const taskInput = document.querySelector('#task-input');
    const taskDate = document.querySelector('#task-date');
    const form = document.querySelector('#task-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value.trim();
        let date = taskDate.value;
        if (task.length == 0) {
            message('You must add a task description!', 3);
            taskInput.focus();
            return;
        }
        if (date.length == 0) {
            date = 'No date declared'
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                message('The selected date has already passed.', 3);
                return;
            }
        }

        Task.addTask(task, date);
        taskInput.value = ''; // ✅ clear input
        taskDate.value = '';
        renderTasks();
    });
}

/**
 * filters tasks when buttons(filters) are clicked.
 */
function addFilterEventListeners() {
    //sorts by date
    const dateFilter = document.querySelector('.sort-by-date');
    dateFilter.addEventListener('click', () => {
        // filterByDate = !filterByDate;
        renderTasks(true);
        message('Sorted tasks by date!');
    });

    filterButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            filter = index;
            message(`Rendering ${filter == 0 ? 'All' : filter == 1 ? 'only activated' : filter == 2 ? 'only completed' : ''} tasks!`);
            renderTasks();
        });
    });
}

/**
 * 
 * @param {number} amount -> amount of tasks to load
 * @returns an array of ToDo tasks.
 * uses an API to load the data (tasks).
 */
async function fetchInitialTasks(amount = 5) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${amount}`);
    if (!response.ok) {
        console.log(`Loading Error ${response.status}`);
        return [];
    }
    const tasks = await response.json();
    return tasks.map(task => {
        return new Task({
            name: task.title,
            isCompleted: task.completed,
            date: new Date().toISOString().split("T")[0]
        });
    });
}

let messageTimeoutId;
let timerMS = 0;
let removingMessage = false;
const messageContainer = document.querySelector('.message-container');
/**
 * 
 * @param {string} messageText 
 * @param {number} type -> 1: normal, 2: success, 3: error message
 */
function message(messageText, type = 1) {
    const color = type == 1 ? 'white' : type == 2 ? 'green' : 'red';
    const messageP = document.getElementById('message');
    messageContainer.style.transform = 'translateY(0%)';
    messageContainer.style.backgroundColor = color;
    messageP.textContent = messageText;
    if (timerMS > 0) {
        timerMS = 3000;
    } else {
        timerMS = 3000;
        removeMessage();
    }
}

async function removeMessage() {
    if (timerMS <= 0) {
        messageContainer.style.transform = 'translateY(-100%)';
        return;
    }
    timerMS -= 100;
    await sleep(100);
    removeMessage();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    await getTasks();
    renderTasks();
    addFormEventListener();
    addFilterEventListeners();
}

start();