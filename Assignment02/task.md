You must implement a dynamic webpage the provides a basic task-list functionality. In particular, you page should provide a user an interface to add and remove a task as well as mark a task as completed. For this version of the assignment, the tasks will be added directly in the HTML page by manipulating the DOM. Moreover, you should maintain an array that stores task details. Each task comprise of three fields:

task-title: which is a one-line description of the task
task-priority: which can be one of low-, medium- or high-priority.
task-status: Which can be, either completed, or pending
Requirements

Your implementation should address the following requirements:

Your HTML page should provide a form to allow the user to specify the details of a new task (i.e. task-title, as text; task-priority, as a select tag; and a task-status as a radio button selection), and a submit button.

+Adding a task should append that task in an array as well as append the task-list in the HTML (i.e. append a new <li> item with the task details to the DOM). The task should display all task information, and provide additional controls to allow a user to 'remove' that task (i.e. have a remove button next to the task) and to mark the task as complete (i.e. have a mark as complete button next to the task)

+Programmatically register an 'onsubmit' event that will handle adding a new task to the DOM.

+Programmatically register events to handle the remove and mark as complete.

+When removing a task, remove it both from the array and the DOM.

+When marking a task as complete, have that task shown as strike-through, by programmatically updating its CSS styles (for example, set the text-decoration property).

+Use HTML, CSS and Bootstrap to style your page. Your styling of the task-list page must be visually appealing and the content of the page must be relevant to this assignment.

+Your HTML page, the CSS styling and your separate javascript file, along with any other resources you might use (ie. images) must be hosted on github-pages and be accessible through the web. Store all files for this assignment under a subfolder called "Assignment02" under your main repository.