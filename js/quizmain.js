import { questionList } from "./questionData.js";

const quizState = document.querySelector("#quiz-state");
let currentState; //checks which is the current state
const bodyEl = document.querySelector("body");

let introState = {
    createDom:function(state){
        const introState = document.createElement("div");
        introState.className = "intro-state";
        introState.innerHTML += "<h2 class='questiontext'>Welcome to Daily Quiz!</h2>";
        introState.innerHTML += "<p class='messageDisplay'>Today we will test your knowledge of geography.</p><br/>";
        introState.innerHTML += "<input type='button' value='START QUIZ' class='greenButton' id='start-quiz-btn'>";
        state.appendChild(introState);
        document.querySelector("#start-quiz-btn").addEventListener("click", startQuiz);
    }
}

let questionState = {
    currentQuestion:null,
    usersAnswers:[],
    questionDisplay:"",
    listOfAnswers:"",
    messageDisplay:"",
    createDom:function(state){
        const questionStateEl = document.createElement("div");
        questionStateEl.className = "question-state";

        const questionContainer = document.createElement("div");
        questionContainer.className = "question-container";
        
        questionContainer.innerHTML += "<h2 class='questiontext' id='question-text'>Insert Question</h2>";
    
        const answersBox = document.createElement("div");
        answersBox.className = "answersbox";
        answersBox.innerHTML += "<ul class='answersListStyle' id='listanswers'></ul>";
        answersBox.innerHTML += "<p id='answerErrorMessage' class='errorMessage'></p><br /> ";
        answersBox.innerHTML += "<input type='button' value='NEXT' class='greenButton' id='next-button'>";

        questionContainer.appendChild(answersBox);
        questionStateEl.appendChild(questionContainer);

        questionStateEl.innerHTML += "<input type='button' value='CHECK ANSWERS' class='greenButton' id='check-button' disabled>";
        state.appendChild(questionStateEl);

        document.querySelector("#next-button").addEventListener("click", nextQuestionItem);
        document.querySelector("#check-button").addEventListener("click", checkAnswers);
        this.questionDisplay = document.querySelector("#question-text");
        this.listOfAnswers = document.querySelector("#listanswers");
        this.messageDisplay = document.querySelector("#answerErrorMessage");
    },
    reset:function(){
        this.usersAnswers = [];
        this.currentQuestion = null;
    },
    completeMessage:function(){

        if(currentState !== questionState){
            console.log("Not in questionState. Aborting");
            return;
        }

        questionState.questionDisplay.textContent = "QUIZ DONE!";
        deleteChildren(questionState.listOfAnswers);
        questionState.messageDisplay.textContent = "Now you can correct the test";
        document.querySelector("#next-button").style.visibility = "hidden";
    }
}

let resultState = {
    createDom:function(state){
        const resultStateEl = document.createElement("div");
        resultStateEl.className = "quizresult-state";
        resultStateEl.innerHTML += "<h2>Your Score:</h2>";

        const resultCircle = document.createElement("div");
        resultCircle.className = "result-circle";
        resultCircle.innerHTML += "<span id='result-message'></span>";
    
        resultStateEl.appendChild(resultCircle);

        state.appendChild(resultStateEl);
    }
}

function populateQuestion(questionItem){

    if(currentState !== questionState){
        console.log("Not in questionState. Aborting");
        return;
    }

    let nrAnswers = 0;

    //reset question form
    deleteChildren(questionState.listOfAnswers);

    const questionNr = questionList.indexOf(questionItem) + 1;

    questionState.questionDisplay.textContent = "Question " + questionNr + ": " + questionItem.question;

    questionItem["answers"].forEach((elem)=> {
        nrAnswers++;

        //listItem
        const listItem = document.createElement("li");
        listItem.className ="answerItem";

        //stuff in list items
        let answerID = questionItem.id + (nrAnswers+1);
        listItem.innerHTML += `<input type=${questionItem.type} name=${questionItem.id} id=${answerID} value=${nrAnswers}>`;
        listItem.innerHTML += `<label for=${answerID}>${elem}</label><br />`;
        questionState.listOfAnswers.appendChild(listItem);
    })
    //console.log("currentState is questionState: ", Object.is(currentState, questionState));
    questionState.currentQuestion = questionItem;
}

function startQuiz(){
    //console.log("quiz started");
    setCurrentState(questionState);
    populateQuestion(questionList[0]);
}

//EVENT LISTENERS

document.querySelector("#retry-button").addEventListener("click", () =>{
    //dont retry if the quiz is in intro or if the user is in the first question
    if(currentState === introState || 
        currentState === questionState && questionState.currentQuestion === questionList[0]){
        console.log("You just started the quiz");
        return;
    }
    console.log("retry quiz");
    questionState.reset();
    setCurrentState(questionState);
    populateQuestion(questionList[0]);
})

document.querySelector("#light-menu-item").addEventListener("click", () =>{
    console.log("light them active");
    bodyEl.className = "lighttheme";
})

document.querySelector("#dark-menu-item").addEventListener("click", () =>{
    console.log("dark them active");
    bodyEl.className = "darktheme";
})

// UTILITY FUNCTIONS

function nextQuestionItem(){
    //console.log("nextQuestionItem called");
    let radioButtonAnswers = document.querySelectorAll(`input[name=${questionState.currentQuestion.id}]`); //get radiobuttons and checkboxes
    let currentIndex = questionList.indexOf(questionState.currentQuestion);

    //is there anymore questions to fill? If no abort function
    if(questionState.usersAnswers.length >= questionList.length){
        console.log("No more questions left");
        return;
    }

    //has the user pressed any answer?
    if(Array.from(radioButtonAnswers).filter(elem => elem.checked === true).length === 0){
        questionState.messageDisplay.textContent = "You must provide an answer";
        return;
    }
    questionState.messageDisplay.textContent = "";

    let answeresChecked = [];
    radioButtonAnswers.forEach(elem =>{
        if(elem.checked){
            answeresChecked.push(parseInt(elem.value));
        }
    })

    let answer = {
        id:questionState.currentQuestion.id,
        answers:answeresChecked
    }

    //console.log(answer);

    questionState.usersAnswers.push(answer);

    //console.log(questionList[currentIndex].id);

    //next question if there is any
    if(currentIndex+1 < questionList.length){
        populateQuestion(questionList[currentIndex+1]);
    }

    //console.log(currentIndex);
    //was that the last question? If so disable next button and enabled check answers button
    if(currentIndex+1 >= questionList.length){
        document.querySelector("#next-button").disabled = true;
        document.querySelector("#check-button").disabled = false;
        questionState.completeMessage();
    }
    
}

//function for check answers button
function checkAnswers(){
    
    //console.log("check-button");

    //if the user is still answering the questions and pressing the check button to early
    if(currentState == questionState && questionState.usersAnswers.length < questionList.length){
        questionState.messageDisplay.textContent = "You must first complete the quiz before checking.";
        return;
    }

    //if using this function when the app is not in questionState
    if(currentState !== questionState){
        console.log("Not in questionState. Aborting");
        return;
    }

    setCurrentState(resultState);

    displayResults();
}

function displayResults(){

    if(currentState !== resultState){
        console.log("Not in results. Aborting")
        return;
    }

    let nrOfCorrectAnswers = 0;

    questionList.forEach(elem => {
        
        let typedAnswers = questionState.usersAnswers.find(a => a.id === elem.id).answers; //get users answer based on id
        let correctAnswers = elem.correct; //get the correct answers
        
        
        let isCorrectAnswer = correctAnswers.every(a => typedAnswers.includes(a)) && typedAnswers.length == correctAnswers.length;
        
        // console.log(`----------------${elem.id}--------------------`);
        // //get question from questionList based on index number
        // console.log("Users answers: ", ...typedAnswers);
        // console.log("Correct answers: ", ...correctAnswers);
        // console.log("Answered correctly? ", isCorrectAnswer);
        //is the answers between question and users answers to that question correct? Find how many answers the user scored
        if(isCorrectAnswer){
            nrOfCorrectAnswers++;
        }
    });
    
    const resultCircle =  document.querySelector(".result-circle");
    let userScore = nrOfCorrectAnswers/questionList.length * 100;
    document.querySelector("#result-message").textContent = userScore + "%";
    if(userScore >= 75){
        resultCircle.classList.toggle("result-circle-green");
    }
    else if(userScore >= 50){
        resultCircle.classList.toggle("result-circle-orange");
    }
    else{
        resultCircle.classList.toggle("result-circle-normal");
    }
}

function setCurrentState(state){
    currentState = state;
    deleteChildren(quizState);
    state.createDom(quizState);
    
}

function deleteChildren(element){
    while(element.firstChild){
        element.removeChild(element.lastChild);
    }
}

setCurrentState(introState);