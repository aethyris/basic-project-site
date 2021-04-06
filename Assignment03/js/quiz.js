const source = 'https://my-json-server.typicode.com/aethyris/cus1172-project1/';
let studentName = '';
let quizSelector = '';
let correctQuestions = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderView('#provide-name');
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
        const model = {
            'name': studentName,
            'quizzes': dataJSON,
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

const startQuizView = (quiz) => {
    quizSelector = quiz;
    createQuestionView(1);
}

const submitAnswer = async (questionId) => {
    const data = await fetch(`${source}/${quizSelector}/?id=${questionId}`);
    const model = await data.json();
    switch(model[0].type) {
        case 'multiple-choice':
            const correctAnswer = model[0].answer;
            const givenAnswer = document.querySelector('input[name=answer]:checked').value
            if (!givenAnswer) {
                alert('Please select an answer to the question.');
            } else {
                console.log(correctAnswer == givenAnswer);
            }
            break;
    }
}