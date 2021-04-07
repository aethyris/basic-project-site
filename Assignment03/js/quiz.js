const source = 'https://my-json-server.typicode.com/aethyris/cus1172-project1/';
let studentName = '';
let correctAnswers = 0;

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
    // Get question
    const questionData = await fetch(`${source}/questions?id=${questionId}`);
    const questionJSON = await questionData.json();
    const model = questionJSON[0]

    // Get quiz data for more information
    const quizId = model['quiz-id']
    const quizData = await fetch(`${source}/quizzes?quiz-id=${quizId}`);
    const quizJSON = await quizData.json();
    const questionList = quizJSON[0].questions;
    const questionIndex = questionList.findIndex(element => element == questionId);

    model['question-number'] = questionIndex + 1
    model['quiz-length'] = questionList.length
    model['quiz-progress'] = Math.round((questionIndex/questionList.length)*100)
    model['quiz-name'] = quizJSON[0].name

    switch(model["question-type"]) {
        case 'multiple-choice':
            renderView('#multiple-choice', model);
            break;
    }
}

const submitAnswer = async (questionId) => {
    const data = await fetch(`${source}/answers?question-id=${questionId}`)
    const dataJSON = await data.json();
    const model = dataJSON[0]
    if (model['answer-type'] == "radio") {
        const givenAnswer = document.querySelector('input[name=answer]:checked').value
        if (!givenAnswer) {
            alert('Please select an answer to the question.');
        } else if (model.answer == givenAnswer) {
            const congratsList = [
                'Brilliant!',
                'Awesome!',
                'Good work!'
            ]
            renderView('#correct-answer', {
                "success-message": congratsList[Math.floor(Math.random() * congratsList.length)] 
            });
        } else {
            renderView('#incorrect-answer', model);
        }
    }
}