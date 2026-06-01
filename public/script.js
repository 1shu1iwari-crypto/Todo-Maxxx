const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

// Fetch and display all todos
function loadTodos() {
    fetch('/api/todos')
        .then(function(response) {
            return response.json();
        })
        .then(function(todos) {
            todoList.innerHTML = '';
            
            if (todos.length === 0) {
                todoList.innerHTML = '<li style="justify-content:center; border-left: none;">No tasks yet!</li>';
                return;
            }
            
            todos.forEach(function(todo) {
                const li = document.createElement('li');
                
                // Add the 'completed' class if the task is done
                if (todo.completed) {
                    li.classList.add('completed');
                }
                
                // Create the left side (checkbox + text)
                const taskContent = document.createElement('div');
                taskContent.className = 'task-content';
                
                // Clicking the text/checkbox will toggle the task
                taskContent.onclick = function() {
                    toggleTodo(todo.id);
                };
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                // Prevent checkbox click from double-firing the toggle event
                checkbox.onclick = function(e) {
                    e.stopPropagation();
                    toggleTodo(todo.id);
                };
                
                const span = document.createElement('span');
                span.innerText = todo.text;
                
                taskContent.appendChild(checkbox);
                taskContent.appendChild(span);
                
                // Create the delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '🗑️'; // Trash can emoji
                deleteBtn.onclick = function() {
                    deleteTodo(todo.id);
                };
                
                // Put it all together
                li.appendChild(taskContent);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
        });
}

function addTodo() {
    const text = todoInput.value;
    if (text.trim() === '') return;
    
    fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    })
    .then(function() {
        todoInput.value = '';
        loadTodos();
    });
}

// Function to mark a task as done or undone
function toggleTodo(id) {
    fetch('/api/todos/' + id, {
        method: 'PUT'
    })
    .then(function() {
        loadTodos(); // Reload to show the new checked state
    });
}

// Function to delete a task
function deleteTodo(id) {
    fetch('/api/todos/' + id, {
        method: 'DELETE'
    })
    .then(function() {
        loadTodos(); // Reload to show the item is gone
    });
}

addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') addTodo();
});

loadTodos();

// --- Spotlight Effect Logic ---
const container = document.querySelector('.container');
container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    // Calculate mouse position relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables for the radial-gradient
    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
});
