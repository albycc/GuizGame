/*
Question data to populate the app

Each object has five variables.
"id" - explanatory, the variable to identify the question. Must be unique
"question" - The question itself in text
"type" - type of input. MUST be either radio for one choice, or checkbox, where multiple answers can occur
"answers" - The anwsers to the question the user can choose in an array. Will populate a list of inputs whose type is dependent on the previous variable
"correct" - An array of correct answers. Here it represents in integers, 1 - 4, where each number corresponds to the answers above in ascending order. 
    If 1 is stored, the first answer is correct, and so forth. There can be multiple correct answers if a checkbox is used.
*/

let questionList = [
    {
        "id": "question1",
        "question": "What is the Capital of the United Kingdom?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Paris",
            "London",
            "Madrid",
            "Berlin"
        ],
        "correct": [2]
    },
    {
        "id": "question2",
        "question": "What is the Capital of Germany?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Berlin",
            "Stockholm",
            "Paris",
            "Munich"
        ],
        "correct": [1]
    },
    {
        "id": "question3",
        "question": "What is the Capital of France?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Moscow",
            "Rome",
            "Paris",
            "Marseille"
        ],
        "correct": [3]
    },
    {
        "id": "question4",
        "question": "Of the following cities, which one is in Great Britain?",
        "type": "checkbox", //radio or checkbox
        "answers": [
            "Edinburgh",
            "Belfast",
            "Manchester",
            "Dublin"
        ],
        "correct": [1, 3]
    },
    {
        "id": "question5",
        "question": "What is the Capital of Croatia?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Lisbon",
            "Kiev",
            "Zagreb",
            "Madrid"
        ],
        "correct": [3]
    },
    {
        "id": "question6",
        "question": "What is the Capital of the Netherlands?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Riga",
            "Bern",
            "Bryssel",
            "Amsterdam"
        ],
        "correct": [4]
    },
    {
        "id": "question7",
        "question": "Which of the following countries borders the mountain Monc Blanc?",
        "type": "checkbox", //radio or checkbox
        "answers": [
            "France",
            "Lichtenstein",
            "Germany",
            "Italy"
        ],
        "correct": [1, 4]
    },
    {
        "id": "question8",
        "question": "Which of the following countries does the river Donau flow through?",
        "type": "checkbox", //radio or checkbox
        "answers": [
            "Czeck Republic",
            "Romania",
            "Germany",
            "Bulgaria"
        ],
        "correct": [2, 3, 4]
    },
    {
        "id": "question9",
        "question": "What is the Capital of Albania?",
        "type": "radio", //radio or checkbox
        "answers": [
            "Bukarest",
            "Tirana",
            "Krakow",
            "Sarajevo"
        ],
        "correct": [2]
    },
    {
        "id": "question10",
        "question": "Which of the following small countries exists in Italy?",
        "type": "checkbox", //radio or checkbox
        "answers": [
            "San Marino",
            "The Vatican State",
            "Andorra",
            "Monaco"
        ],
        "correct": [1, 2]
    }
];

export {questionList};