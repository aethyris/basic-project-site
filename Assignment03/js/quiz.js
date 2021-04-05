const source = 'https://my-json-server.typicode.com/aethyris/cus1172-project1/';
let studentName = '';
let quizSelector = 'quiz1';

document.addEventListener('DOMContentLoaded', () => {
    renderView('#provide-name');
    // createQuestionView(1);
})

const renderView = (view, model) => {
    const templateSource = document.querySelector(view).innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(model);
    document.querySelector('#app-widget').innerHTML = html;
}

const selectQuizView = async () => {
    studentName = document.querySelector('#student-name').value;
    if (studentName == '') {
        alert('Please enter a valid name.')
    } else {
        const data = await fetch(`${source}/quizzes`);
        const dataJSON = await data.json();
        console.log(dataJSON);
        const model = {
            'name': studentName,
        };
        renderView('#select-quiz', model);
    }
}

const createQuestionView = async (questionId) => {
    const data = await fetch(`${source}/${quizSelector}/?id=${questionId}`);
    const model = await data.json();
    switch(model[0].type) {
        case 'multiple-choice':
            renderView('#multiple-choice', model[0]);
            break;
    }
}
