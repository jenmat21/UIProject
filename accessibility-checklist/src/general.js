class Question {
    static QUESTIONS = null;

    constructor(id) {
        this.id = id;
        this.content = Question.QUESTIONS[id].content;
        this.weight = Question.QUESTIONS[id].weight;
        this.hint = Question.QUESTIONS[id].hint;
        this.tip = Question.QUESTIONS[id].tip;
    }

    static read(path) {
        let json = null;
        const request = new XMLHttpRequest();
        request.open('GET', path, false);
        request.send(null);
        if (request.status === 200) 
            json = JSON.parse(request.responseText);
        Question.QUESTIONS = json;
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
        let questions = {};
        for(let id in this.questions)
            questions[id] = {"content": this.questions[id].content, 
                        "hint": this.questions[id].hint};
        ChecklistView.renderQuestions(questions);
    }

    getScore() {
        let yes, total, score;
        [yes, total, score] = [0, 0, 0];

        let answer, weight;
        [answer, weight] = [null, null];
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

    sendScore(score) {
        let rating = "";
        switch (true) {
            case (score <= 20):
                rating = "BAD";
                break;
            case (score <= 40):
                rating = "FAIR";
                break;
            case (score <= 60):
                rating = "GOOD";
                break;
            case (score <= 80):
                rating = "GREAT";
                break;
            case (score <= 100):
                rating = "EXCELLENT";
                break;
        }
        ResultView.renderScore(score, rating);
    }

    sendTips(ids) {
        let tips = [];
        ids.forEach(id => tips.push(this.questions[id].tip));
        ResultView.renderTips(tips);
    }

    getNo() {
        let no = [];
        for(let id in this.questions)
            if(this.questions[id].answer === false)
                no.push(this.questions[id]);
        return no;
    }

    getAnswers() {
        let value, answer;
        for(let id in this.questions) {
            value = document.querySelector(`input[name="q${id}"]:checked`).value;
            if(value === 'null') answer = null;
            else answer = (value === 'true');
            this.questions[id].answer = answer;
        }       
    }

    submit(href) {
        this.getAnswers();
        let score = this.getScore();
        let no = this.getNo();
        let url = `${href}?score=${score}&tips=`;

        no.forEach(question => url += `${question.id},`);
        url = url.slice(0, -1);
        window.location.replace(url);
    }

    clear() {
        ChecklistView.clear();
    }
}

class ChecklistView {
    static renderQuestions(questions) {
        let html = "";
        for(let id in questions)
            html += `
            <div>
                <p>${id}. ${questions[id].content}</p>
                <span class="question-mark">&#10067;</span>
                <span class="hint">${questions[id].hint}</span>

                <form>
                    <input type="radio" name="q${id}" value="true">
                    <label for="yes">Yes</label>
                    <input type="radio" name="q${id}" value="false">
                    <label for="no">No</label>
                    <input type="radio" name="q${id}" value="null" checked="true">
                    <label for="n/a">N/A</label>
                </form>
            </div>`;        
        document.getElementById("checklist").innerHTML = html;
    }

    static clear() {
        document.querySelectorAll(`input[value="null"]`)
                .forEach(input => input.checked = true);
    }
}

class ResultView {
    static renderScore(score, rating) {
        document.querySelector("#score-text p").innerHTML = Math.round(score);
        document.querySelector("#score-rating p").innerHTML = rating;
        document.getElementById("score-bar-bg").style.width = `${score}%`;
    }

    static renderTips(tips) {
        let html = "";
        for(let i = 0; i < tips.length; i++)
            html += `<p>${i+1}. ${tips[i]}</p>`;
        document.getElementById("tips").innerHTML += html;
    }
}