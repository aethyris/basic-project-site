document.addEventListener('DOMContentLoaded', () => {
    renderView('#quiz-selection');
})

const renderQuestionView = async (questionID) => {
    const data = await fetch(`https://`)
}

const renderView = (view) => {
    const templateSource = document.querySelector(view).innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template();
    document.querySelector('#app-widget').innerHTML = html;
}