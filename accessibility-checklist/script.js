class Question {
    static DB_PATH = "./questions.json";
    static QUESTIONS = Question.read();

    constructor(id) {
        this.id = id;
        this.content = Question.QUESTIONS[id].content;
        this.weight = Question.QUESTIONS[id].weight;
        this.hint = Question.QUESTIONS[id].hint;
        this.tip = Question.QUESTIONS[id].tip;
    }

    static read() {
        const request = new XMLHttpRequest();
        request.open('GET', Question.DB_PATH, false);
        request.send(null);
        if (request.status === 200) 
            return JSON.parse(request.responseText);
    }
}

class ChecklistHandler {
    constructor() { 
        this.questions = this.getQuestions(); 
    }

    getQuestions() {
        let questions = {};
        for(let id in Question.QUESTIONS)
            questions[id] = new Question(id);
        return questions;
    }

    sendQuestions() {
        let data = {};
        for(let id in this.questions)
            data[id] = {"content": this.questions[id].content, 
                        "hint": this.questions[id].hint}
        ChecklistView.renderQuestions(data)
    }

    calculateScore() {
        let total = 0;
        let yes = 0;
        let score = 0;
    
        let answer = null;
        let weight = null;
        for(let id in this.questions) {
            answer = this.questions[id].answer;
            weight = this.questions[id].weight;

            if(answer != null) {
                total += weight;
                if(answer === true) yes += weight;
            }
        }

        score = (total === 0) ? 100 : (100 * yes) / total;

        return score;
    }

    getNo() {
        let no = [];
        for(let id in this.questions)
            if(this.questions[id].answer === false)
                no.push(this.questions[id]);
        return no;
    }

    sendScore(score) {
        ResultView.renderScore(score);
    }

    sendTips(ids) {
        let tips = [];
        for(let id in ids)
            tips.push(this.questions[ids[id]].tip);
        ResultView.renderTips(tips);
    }

    receiveAnswers() {
        let answer, result;
        for(let id in this.questions) {
            answer = document.querySelector(`input[name="q${this.questions[id].id}"]:checked`).value;
            if(answer === 'null') result = null;
            else result = (answer === 'true');
            this.questions[id].answer = result;
        }       
    }

    submit(e) {
        let href = e.target.attributes.href.nodeValue;

        this.receiveAnswers();
        let score = this.calculateScore();
        let no = this.getNo();

        let url = `${href}?score=${score}&tips=`
        for(let id in no)
            url += `${no[id].id},`;
        window.location.replace(url);
    }

    clear() {
        for(let id in this.questions)
            document.querySelectorAll(`input[name=q${id}]`)[2].checked = true;
    }
}

class ChecklistView {
    static renderQuestions(questions) {
        let html = "";
        for(let id in questions)
            html += `
            <div>
                <p>${id}. ${questions[id].content}</p>
        
                <a data-title="${questions[id].hint}">
                <img src="./image/questionMark.png" alt="Question mark in a circle">
                </a><br clear="all"/>
        
                <form>
                    <input type="radio" name="q${id}" value="true">
                    <label for="yes">Yes</label>
                    <input type="radio" name="q${id}" value="false">
                    <label for="no">No</label>
                    <input type="radio" name="q${id}" value="null" checked="true">
                    <label for="n/a">N/A</label>
                </form>
            </div>`
        document.getElementById("checklist").innerHTML = html;
    }
}

class ResultView {
    static renderScore(score) {
        document.querySelector("#score-text p").innerHTML = Math.round(score);
        document.getElementById("score-bar-bg").style.width = `${score}%`;
    }

    static renderTips(tips) {
        let html = "";
        for(let i = 0; i < tips.length; i++)
            html += `<p>${i+1}. ${tips[i]}</p>`;
        document.getElementById("tips").innerHTML += html;
    }
}

window.onload = function() {
    let check = new ChecklistHandler();
    let page = window.location.pathname;
    if(page.includes("home.html")) {
        check.sendQuestions();
        document.getElementById("submit-btn").addEventListener("click", (e) => check.submit(e));
        document.getElementById("clear-btn").addEventListener("click", (e) => check.clear(e));
    } else {
        let params = new URLSearchParams(window.location.search);
        check.sendScore(params.get("score"));
        let tips = params.get("tips").split(",");
        tips.pop();
        check.sendTips(tips);
    }
}