const source = 'https://my-json-server.typicode.com/aethyris/cus1172-project1/';
let studentName = '';
let correctAnswers = 0;
let startTime;
let elapsedTimeInterval;

document.addEventListener('DOMContentLoaded', () => {
     document.querySelector('#app-widget').innerHTML = renderView('#provide-name');
})

const renderView = (view, model) => {
    const templateSource = document.querySelector(view).innerHTML;
    const template = Handlebars.compile(templateSource);
    return template(model);
}

const submitName = () => {
    studentName = document.querySelector('#student-name').value;
    if (studentName == '') {
        alert('Please enter a valid name.')
    } else {
        selectQuizView();
    }
}

const selectQuizView = async () => {
    const data = await fetch(`${source}/quizzes`);
    const dataJSON = await data.json();
    const model = {
        'name': studentName,
        'quizzes': dataJSON,
    };
    document.querySelector('#app-widget').innerHTML = renderView('#select-quiz', model);
}

const createQuizView = async (quizId) => {
    // Get quiz data from API
    const quizData = await fetch(`${source}/quizzes?id=${quizId}`);
    const quizJSON = await quizData.json();
    const model = quizJSON[0];

    // Render quiz scoreboard and first question
    document.querySelector('#app-widget').innerHTML = renderView('#quiz-view',model);
    createQuestionView(model.questions[0], quizId);

    // Start timing quiz
    startTime = new Date();
    elapsedTimeInterval = setInterval(() => {
        document.querySelector('#elapsed-time').innerHTML = elaspedTime(startTime)
    }, 1000);
}

const createQuestionView = async (questionId, quizId) => {

    if (questionId < 0) {
        endQuizView(quizId);
    } else {
        // Get question or time for last question
        const questionData = await fetch(`${source}/questions?id=${questionId}`);
        const questionJSON = await questionData.json();
        const questionModel = questionJSON[0];

        // Get quiz data
        const quizData = await fetch(`${source}/quizzes?id=${quizId}`);
        const quizJSON = await quizData.json();
        const currentIndex = quizJSON[0].questions.findIndex(element => element == questionId);
        const quizLength = quizJSON[0].questions.length;
        const quizProgressModel = {
            'current-question': currentIndex + 1,
            'quiz-length': quizLength,
            'score': Math.floor(correctAnswers / quizLength * 100),
            'quiz-progress': currentIndex / quizLength * 100,
        };

        // Update quiz progress
        document.querySelector('#quiz-progress').innerHTML = renderView('#quiz-progress-view',quizProgressModel);

        // Render question
        let html = '';
        switch(questionModel["type"]) {
            case 'mc':
                html = renderView('#multiple-choice', questionModel);
                break;
            case 'solve':
                html = renderView('#solve', questionModel);
                break;
            case 'fillin':
                html = renderView('#fill-in', questionModel);
                break;
            case 'image':
                html = renderView('#image-select', questionModel);
                break;
            case 'correct':
                html = renderView('#correct-error', questionModel);
                break;
        }
        document.querySelector('#question-section').innerHTML = html;
    }
}

const submitAnswer = async (questionId) => {
    // Get the correct answer and the given answer
    const data = await fetch(`${source}/answers?id=${questionId}`)
    const dataJSON = await data.json();
    const model = dataJSON[0];
    let givenAnswer = '';
    if (model['type'] == "radio") {
        givenAnswer = document.querySelector('input[name=answer]:checked').value;
    } else if (model['type'] == 'text') {
        givenAnswer = document.querySelector('#answer').value.trim().toLowerCase();
    }
    // Compare the two answers
    if (!givenAnswer) {
        alert('Please answer the question.');
    } else {
        document.querySelector('#answer-form').remove();

        // Retrieve the next question
        const question = await fetch(`${source}/questions?id=${questionId}`)
        const questionJSON = await question.json();
        const quiz = await fetch(`${source}/quizzes?id=${questionJSON[0]['qid']}`);
        const quizJSON = await quiz.json();
        const questionList = quizJSON[0].questions;
        let nextQuestionIndex = questionList.findIndex(element => element == questionId) + 1

        model['next-question'] = questionList[nextQuestionIndex];
        // For when there is no next question
        if (nextQuestionIndex == questionList.length) {
            clearInterval(elapsedTimeInterval);
            model['next-question'] = -1;
        }

        model['qid'] = quizJSON[0].id;
        if (model.ans == givenAnswer) {
            // Correct answer
            correctAnswers++;
            const congratsList = [
                'Brilliant!',
                'Awesome!',
                'Good work!'
            ]
            document.querySelector('#answer-feedback').innerHTML = renderView('#correct-answer', {
                "success-message": congratsList[Math.floor(Math.random() * congratsList.length)] 
            });
            setTimeout(1000);
            createQuestionView(model['next-question'], model['qid']);
        } else {
            // Incorrect answer
            document.querySelector('#answer-feedback').innerHTML = renderView('#incorrect-answer', model);
        }
    }
}

const elaspedTime = (start) => {
    const end = new Date();
    let elapsed = end.getTime() - start.getTime();
    elapsed = elapsed / 1000;

    const seconds = String(Math.floor(elapsed % 60)).padStart(2, "0");
    elapsed = Math.floor(elapsed / 60);
    const minutes = String(Math.floor(elapsed % 60)).padStart(2, "0");
    elapsed = Math.floor(elapsed / 60);
    const hours = String(Math.floor(elapsed % 24)).padStart(2, "0");

    if (hours == "00") {
        return `${minutes}:${seconds}`;
    } else {
        return `${hours}:${minutes}:${seconds}`;
    }

}

const endQuizView = async (quizId) => {
    const quizData = await fetch(`${source}/quizzes?id=${quizId}`);
    const quizJSON = await quizData.json();
    const model = quizJSON[0];
    const quizLength = model.questions.length;
    model['student-name'] = studentName;
    model['quiz-length'] = quizLength;
    model['correct'] = correctAnswers
    model['score'] = Math.floor((correctAnswers/quizLength) * 100);
    model['time'] = elaspedTime(startTime);

    if (model['score'] > 80) {
        model['pass'] = true;
    }

    correctAnswers = 0;
    document.querySelector('#app-widget').innerHTML = renderView('#quiz-results', model);
}