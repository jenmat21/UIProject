window.onload = function() {
    Question.read("res/questions.json");
    const check = new ChecklistHandler();

    check.sendQuestions();
    document.getElementById("submit-btn").addEventListener("click", (e) => check.submit(e.target.attributes.href.nodeValue));
    document.getElementById("clear-btn").addEventListener("click", () => check.clear());
}