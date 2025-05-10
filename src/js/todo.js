document.addEventListener('DOMContentLoaded', () => {
    const list = {};
    const input = document.querySelector('.todo-block_input');
    const blocks = document.querySelector('.todo-block_list');

    function createItem(taskName, status, idTask) {
        const block = document.createElement('div');
        block.classList.add('todo-block_list_item');

        const label = document.createElement('label');
        label.className = 'checkbox';

        menuItems();

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'license';
        checkbox.className = 'checkbox_input';
        checkbox.checked = status === "completed";

        checkBoxHandler(idTask, checkbox);

        const span = document.createElement('span');
        span.className = 'checkbox_mark';

        label.appendChild(checkbox);
        label.appendChild(span);

        const item = document.createElement('p');
        item.textContent = taskName;
        item.setAttribute('data-id', taskName);

        block.appendChild(label);
        block.appendChild(item);

        return block;
    }

    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            const task = e.target.value;
            taskController(task, "new");
            e.target.value = '';
            showItems()
        }
    })

    window.onhashchange = function() {
        showItems(location.hash.slice(1));
    };

    function showItems(status = location.hash.slice(1)) {
        console.log(status, location.hash)

        while(blocks.firstChild) {
            blocks.removeChild(blocks.firstChild);
        }

        Object.entries(list).forEach((listItem) => {
            if(listItem[1]['status'] === status || status === "") {
                blocks.append(createItem(listItem[1]['name'], listItem[1]['status'], listItem[0]));
            }
        });

        menuItems()

    }

    function menuItems() {
        const barCount = document.querySelector('.todo-block_task-bar_count');
        const clearCompletedButton = document.querySelector('.todo-block_task-bar_clear-button');
        if(Object.values(list).length === 0){
            barCount.innerHTML = '';
            clearCompletedButton.innerHTML = '';
        }
        else {
            barCount.textContent = `${Object.values(list).filter((listItem) => listItem['status'] === 'active').length} Осталось`;
            clearCompleted(clearCompletedButton);
        }
        navigateLinks();
    }

    function navigateLinks() {
        const listItems = document.querySelector('.todo-block_task-bar_list_items');
        console.log(listItems.childNodes, Object.keys(list), Object.values(list), 666);
        if(Object.values(list).length === 0) {
            while(listItems.firstChild) {
                listItems.removeChild(listItems.firstChild);
            }
            return

        }
        if(listItems.children.length === 0){
            const allLink = document.createElement('a');
            const activesLink = document.createElement('a');
            const completedLink = document.createElement('a');
            allLink.className = "todo-block_task-bar_list_items_item";
            activesLink.className = "todo-block_task-bar_list_items_item";
            completedLink.className = "todo-block_task-bar_list_items_item";
            allLink.href = "#";
            activesLink.href = "#active";
            completedLink.href = "#completed";
            allLink.textContent = "Все"
            activesLink.textContent = "Активные"
            completedLink.textContent = "Выполненные"

            listItems.appendChild(allLink);
            listItems.appendChild(activesLink);
            listItems.appendChild(completedLink);

        }
    }

    function clearCompleted(DeleteButton) {
        if (Object.values(list).some((listItem) => listItem['status'] === 'completed')) {
            DeleteButton.textContent = "Очистить завершенные";
        } else {
            DeleteButton.innerHTML = ""
        }

        DeleteButton.onclick = () => {
            const completedIds = Object.keys(list).filter(id => list[id].status === "completed");

            completedIds.forEach(id => {
                taskController(id, 'remove')
            });

            showItems(location.hash.slice(1));
        };
    }

    function checkBoxHandler(idTask, checkbox){
        console.log(list)
        checkbox.addEventListener('click', (e) => {
            if(checkbox.checked === true){
                taskController(idTask, "completed");
            }
            else if(checkbox.checked === false){
                taskController(idTask, "active");
            }
            showItems(location.hash.slice(1));
        })
    }

    function taskController(idTask, typeTask) {
        switch (typeTask) {
            case 'new': {
                const newId = Date.now().toString();
                list[newId] = { name: idTask, status: 'active' };
                break;
            }
            case 'active':
            case 'completed': {
                if (list[idTask]) {
                    list[idTask]['status'] = typeTask;
                }
                break;
            }
            case 'remove': {
                if (list[idTask]) {
                    delete list[idTask];
                }
                break;
            }
        }
    }
})