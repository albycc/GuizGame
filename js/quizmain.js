let questionList = [
    {
        "id": "question1",
        "question": "What is the Capital of Great Britain?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Paris",
            "London",
            "Madrid",
            "Berlin"
        ],
        "correct": [2] //from 1 and so forth
    },
    {
        "id": "question2",
        "question": "What is the Capital of Germany?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Berlin",
            "Stockholm",
            "Paris",
            "New York"
        ],
        "correct": [1] //from 1 and so forth
    },
    {
        "id": "question3",
        "question": "What is the Capital of France?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Moscow",
            "Rome",
            "Paris"
        ],
        "correct": [3] //from 1 and so forth
    },
    {
        "id": "question4",
        "question": "Of the following cities, which one is in Great Britain?",
        "type": "checkbox", //radio or checkbox
        "answers": [
            "Edinburgh",
            "Oslo",
            "Manchester",
            "Lisbon"
        ],
        "correct": [1, 3] //from 1 and so forth
    }
];

const quizState = document.querySelector("#quiz-state");
let currentState; //checks which is the current state
//let currentQuestion = null; //the current question the user is in. Retrived from questionList
//let usersAnswers = []; //lists the answers the user has chosen. Stored as objects.

let introState;
let questionState;
let resultState;


function createQuestionState(state){

    questionState = {
        currentQuestion:null,
        usersAnswers:[]
    }
    const questionStateEl = document.createElement("div");
    questionStateEl.className = "question-state";

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    questionContainer.innerHTML += `<h2 class="questiontext" id="question-text">Insert Question</h2>`;
    
    const answersBox = document.createElement("div");
    answersBox.className = "answersbox";
    answersBox.innerHTML += `<ul class="answersListStyle" id="listanswers"></ul>`;
    answersBox.innerHTML += `<p id="answerErrorMessage" class="errorMessage"></p> `;
    answersBox.innerHTML += `<input type="button" value="NEXT" class="greenButton" id="nextButton">`;

    questionContainer.appendChild(answersBox);
    questionStateEl.appendChild(questionContainer);

    questionStateEl.innerHTML += `<input type="button" value="CHECK ANSWERS" class="greenButton" id="check-button">`;
    state.appendChild(questionStateEl);
    setCurrentState(questionState);
}

createQuestionState(quizState);
populateQuestion(questionList[0]);

function populateQuestion(questionItem){

    const answersList = document.querySelector("#listanswers");
    let nrAnswers = 0;

    //reset question form
    document.querySelector("#question-text").textContent = "";
    while(answersList.firstChild){
        answersList.removeChild(answersList.lastChild);
    }

    document.querySelector("#question-text").textContent = questionItem.question;

    questionItem["answers"].forEach(elem => {
        nrAnswers++;

        //listItem
        const listItem = document.createElement("li");
        listItem.className ="answerItem";

        //stuff in list items
        let answerID = elem.toLowerCase();
        listItem.innerHTML += `<input type=${questionItem.type} name=${questionItem.id} id=${answerID} value=${nrAnswers}>`;
        listItem.innerHTML += `<label for=${answerID}>${elem}</label>`;
        answersList.appendChild(listItem);
    })
    console.log("currentState is questionState: ", Object.is(currentState, questionState));
    questionState.currentQuestion = questionItem;
}

//EVENT LISTENERS

document.querySelector("#nextButton").addEventListener("click", () =>{
    let radioButtonAnswers = document.querySelectorAll(`input[name=${questionState.currentQuestion.id}]`); //get radiobuttons and checkboxes
    let currentIndex = questionState.currentQuestion.id.match(/\d+/g)[0] -1 ; //get current index of question in questionList with regex
    const errorMessage = document.querySelector("#answerErrorMessage");

    //has the user pressed any answer?
    if(Array.from(radioButtonAnswers).filter(elem => elem.checked === true).length === 0){
        errorMessage.textContent = "You must provide an answer";
        return;
    }
    errorMessage.textContent = "";

    let answeresChecked = [];
    radioButtonAnswers.forEach(elem =>{
        if(elem.checked){
            answeresChecked.push(parseInt(elem.value));
        }
    })

    let answer = {
        questionid:questionState.currentQuestion.id,
        answers:answeresChecked
    }

    questionState.usersAnswers.push(answer);

    //next question
    if(currentIndex+1 < questionList.length){
        populateQuestion(questionList[currentIndex+1]);
    }
    else{
        console.log("End of the quiz");
    }
})

document.querySelector("#check-button").addEventListener("click", () =>{
    correctQuiz();
})

// UTILITY FUNCTIONS

function correctQuiz(){
    console.log("check-button")
    questionState.usersAnswers.forEach(elem => {
        console.log(`----------------${elem.questionid}--------------------`);

        //get question from questionList based on index number
        let correctAnswers = questionList[questionState.usersAnswers.indexOf(elem)].correct;
        console.log("Users answers: ", ...elem.answers);
        console.log("Correct answers: ", ...correctAnswers);

        //is the answers between question and users answers to that question correct? Find how many answers the user scored
        let correct = elem.answers.every(a => correctAnswers.includes(a));

        console.log("Answered correctly? ", correct)
    });
}

function setCurrentState(state){
    currentState = state;
}