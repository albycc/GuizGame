/*
quizmain.js

The main JS file to run the quiz app

*/

//grab question data
import { questionList } from "./questionData.js";

//global variables
const quizState = document.querySelector("#quiz-state");
let currentState; //checks which is the current state
const bodyEl = document.querySelector("body");

/* states
The states to represent what the quiz will show in the DOM
There are introState, questionState and resultState
Each state has a createDom function, when called creates the html elements on the document.
*/

/*  introState
At the beginning of the quiz, the user will be greated with a warm welcome
It tells the user what the quiz is about and a button to play the quiz
*/
let introState = {
    createDom:function(state){
        const introState = document.createElement("div");
        introState.className = "intro-state";
        introState.innerHTML += "<h2 class='questiontext'>Welcome to Daily Quiz!</h2>";
        introState.innerHTML += "<p class='messageDisplay'>Today we will test your knowledge of Europe's geography.</p><br/>";
        introState.innerHTML += "<input type='button' value='START QUIZ' class='greenButton' id='start-quiz-btn'>";
        state.appendChild(introState);
        document.querySelector("#start-quiz-btn").addEventListener("click", startQuiz);
    }
}

/*  questionState
The quiz itself with plenty of questions to answer

Includes a question header, a box container, unordered list of inputs with answers to the question, 
a message container and a button to continue to the next question

--Variables--
currentQuestion - the current question the user is answering, so we easily know what answers to retrieve.
usersAnswers - an array of objects for saving the answers the user has seleted
questionDisplay - points to a question header in the DOM tree
listOfAnswers - points to an unordered list of answers in the questionbox, where the user is selecting an answer
messageDisplay - prints messages in the question box 

--functions--
reset() - resets the question, Mainly used when the user has pressed the retry button
completeMessage() - calls after the last question
*/
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

/*  resultState
The Score to display in percentage

Includes a header and a circle container to store your score. The circle will change color depending on the score:
    Blue - Lower than 50%
    Orange - Above 50%
    Green - Above 75%
*/
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

/*
Function for filling out the question form with the question data provided

--parameters--
questionItem - The question object grabbed from the questionList
*/
function populateQuestion(questionItem){

    //if you accidentally use this function while not in questionState
    if(currentState !== questionState){
        console.log("Not in questionState. Aborting");
        return;
    }

    //Variable for keeping the number of questions. Used for identifying the answer and for remembering what answer the user has selected
    let nrAnswers = 0;

    //delete previous answers
    deleteChildren(questionState.listOfAnswers);

    //Create question header. First the question number is created. Then comes the question itself.
    questionState.questionDisplay.textContent = "Question " + (questionList.indexOf(questionItem) + 1) + ": " + questionItem.question;

    //loop and create the answers in the question box
    questionItem["answers"].forEach((elem)=> {
        nrAnswers++;

        //listItem
        const listItem = document.createElement("li");
        listItem.className ="answerItem";

        //stuff in list items with input and label. Here we are grabbing what answer type (radio or checkbox),
        //input name, id used for connecting labels and integer value for storring answers.
        let answerID = questionItem.id + (nrAnswers);
        listItem.innerHTML += `<input type=${questionItem.type} name=${questionItem.id} id=${answerID} value=${nrAnswers}>`;
        listItem.innerHTML += `<label for=${answerID}>${elem}</label><br />`;
        questionState.listOfAnswers.appendChild(listItem);
    });

    //Let the app know this is the current question.
    questionState.currentQuestion = questionItem;
}

//----------EVENT LISTENERS---------

//event listener for start quiz button. Starts the game
function startQuiz(){
    //console.log("quiz started");
    setCurrentState(questionState);
    populateQuestion(questionList[0]);
}

//event listener when the user has clicked the retry button at the top of the page. Resets the quiz and takes the user to the first question
document.querySelector("#retry-button").addEventListener("click", () =>{

    //dont retry if the quiz is still in the intro or if the user is in the first question in the quiz
    if(currentState === introState || 
        currentState === questionState && questionState.currentQuestion === questionList[0]){
        console.log("You just started the quiz");
        return;
    }
    questionState.reset();
    setCurrentState(questionState);
    populateQuestion(questionList[0]);
})

//event listeners for selecting light or dark theme in the settings dropdown
document.querySelector("#light-menu-item").addEventListener("click", () =>{
    console.log("light them active");
    bodyEl.className = "lighttheme";
})

document.querySelector("#dark-menu-item").addEventListener("click", () =>{
    console.log("dark them active");
    bodyEl.className = "darktheme";
})

/*
Function for storring the answers the user has selected from the questionbox
First we grab all the answers from the questionbox
Then we create an object for storring the users answer
Then proceed to create the next question
*/
function nextQuestionItem(){

    //get radiobuttons and checkboxes
    let radioButtonAnswers = document.querySelectorAll(`input[name=${questionState.currentQuestion.id}]`);
    console.log(radioButtonAnswers);
    //What index is the current question in the question list. Used for grabbing the next question and for handling errors.
    let currentIndex = questionList.indexOf(questionState.currentQuestion);

    //is there anymore questions to fill? If no abort function
    if(questionState.usersAnswers.length >= questionList.length){
        console.log("No more questions left");
        return;
    }

    //has the user pressed any answer?
    if(Array.from(radioButtonAnswers).every(elem => elem.checked === false)){
        questionState.messageDisplay.textContent = "You must provide an answer";
        return;
    }

    //must make sure there are any error messages when the user has pressed the next button
    questionState.messageDisplay.textContent = "";

    //grab the users answeres in integers. The questionlist has objects taht stores the correct answes in integers, so we grab what value the input answers has stored
    let answeresChecked = [];
    radioButtonAnswers.forEach(elem =>{
        if(elem.checked){
            answeresChecked.push(parseInt(elem.value));
        }
    })
    
    /*
    The object to store the users answers
    id - the question id that matches the current question
    answers - an array of integers for storring the users answers.
    */
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

    //was that the last question? If so disable next button and enabled check answers button
    if(currentIndex+1 >= questionList.length){
        document.querySelector("#next-button").disabled = true;
        document.querySelector("#check-button").disabled = false;
        questionState.completeMessage();
    }
}

//event listener for check answers button. When the check answers button is enabled, the user can see the quiz score in the result state.
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

/*
Function used to calculate the quiz result and display it in the page
We first ahve a varaible that holds how many corret answers the user has scored.

Then we loop the questionList and each question find the users answer to that question and compare the answers
Then we display the score in a circle container, which cahnges colour depending on the users score.
*/
function displayResults(){

    //must make sure to use this function if we are in the result state
    if(currentState !== resultState){
        console.log("Not in results. Aborting")
        return;
    }

    //nr of correct answers
    let nrOfCorrectAnswers = 0;

    questionList.forEach(elem => {
        
        let typedAnswers = questionState.usersAnswers.find(a => a.id === elem.id).answers; //get users answer based on id
        let correctAnswers = elem.correct; //get the correct answers
        
        //is the answers between question and users answers to that question correct? Find how many answers the user scored
        //Here is the big deal of checking if the user has answered the correctly. We will see if users answers is indeed in the correct answers
        //Also remember that answeres can come in multiple choices so if the user has answered one correctly, but there were more correct answeres, the comparison returns true
        //That's why we also need to check if the correct answers is equal to the users answers, by comparing the two arrays length
        //If all is true increment nrOfCorrectAnswers
        if(correctAnswers.every(a => typedAnswers.includes(a)) && typedAnswers.length == correctAnswers.length){
            nrOfCorrectAnswers++;
        }
        
        ////console logs to test function
        // console.log(`----------------${elem.id}--------------------`);
        // //get question from questionList based on index number
        // console.log("Users answers: ", ...typedAnswers);
        // console.log("Correct answers: ", ...correctAnswers);
        // console.log("Answered correctly? ", isCorrectAnswer);

    });
    
    //Now show the results
    const resultCircle =  document.querySelector(".result-circle");
    //score in percentage
    let userScore = nrOfCorrectAnswers/questionList.length * 100;
    document.querySelector("#result-message").textContent = userScore + "%";
    //green circle colour
    if(userScore >= 75){
        resultCircle.classList.toggle("result-circle-green");
    }
    //orange circle colour
    else if(userScore >= 50){
        resultCircle.classList.toggle("result-circle-orange");
    }
    //blue circle colour
    else{
        resultCircle.classList.toggle("result-circle-normal");
    }
}

/*
function for switching state

--params--
state - the state object you want to swtich. Make sure it has the necesarry functions, like createDom()
*/
function setCurrentState(state){
    currentState = state;
    deleteChildren(quizState);
    state.createDom(quizState);
    
}

/*
Function for removing DOM children of parent element

Mainly used for clearing out elements from previous state or clearing list
*/
function deleteChildren(element){
    while(element.firstChild){
        element.removeChild(element.lastChild);
    }
}

//when app is running, the user will see the intro of the quiz
setCurrentState(introState);