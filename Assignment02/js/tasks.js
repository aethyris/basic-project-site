document.addEventListener('DOMContentLoaded', function() {
    const taskList = [];

    document.querySelector('#new-task-form').onsubmit = function() {
        const title = document.querySelector('#task-title').value;
        const status = document.querySelector('input[name="task-status"]:checked').value;
        const priority = document.querySelector('#task-priority').value;

        // add to taskList

        const task = {
            'task-title': title,
            'task-priority': priority,
            'task-status': status
        };
        taskList.push(task);

        const element = document.createElement('li');
        let taskHTML;
        if (status == 'pending') {
            taskHTML = `
                        <span><span class="task-title">${title}</span> - ${priority}</span>
                        <button class="complete"><i class="fas fa-check"></i></button>
                        <button class="remove"><i class="far fa-trash-alt"></i></button>
            `;
        } else {
            taskHTML = `
                        <span style="text-decoration: line-through; color: lightgrey;"><span class="task-title">${title}</span> - ${priority}</span>
                        <button class="pending"><i class="fas fa-undo"></i></button>
                        <button class="remove"><i class="far fa-trash-alt"></i></button>
            `;
        }
        element.innerHTML = taskHTML;
        document.querySelector("#task-list").append(element);
        document.querySelector('#task-title').value = '';

        return false;
    }

    document.addEventListener('click', function(event) {
        element = event.target;
        if (element.className === 'remove') {
            const title = element.parentElement.querySelector('.task-title').innerHTML;
            const pos = taskList.findIndex(task => task['task-title'] === title);
            if (pos >= 0) {
                taskList.splice(pos, 1);
            }

            element.parentElement.remove();
        } else if (element.className === 'complete') {
            const title = element.parentElement.querySelector('.task-title').innerHTML;
            taskList.find(item => item['task-title'] === title)['task-status'] = 'complete';
            console.log(taskList)

            const task = element.parentElement.getElementsByTagName('span')[0];
            task.style.textDecoration = 'line-through';
            task.style.color = 'lightgray';
            element.innerHTML = '<i class="fas fa-undo"></i>';
            element.classList.remove('complete');
            element.classList.add('pending');
        } else if (element.className === 'pending') {
            const title = element.parentElement.querySelector('.task-title').innerHTML;
            taskList.find(item => item['task-title'] === title)['task-status'] = 'pending';
            console.log(taskList)

            const task = element.parentElement.getElementsByTagName('span')[0];
            task.style.textDecoration = '';
            task.style.color = '';
            element.innerHTML = '<i class="fas fa-check"></i>';
            element.classList.remove('pending');
            element.classList.add('complete');
        }
    })
})