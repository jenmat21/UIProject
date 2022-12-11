window.onload = function() {
    Question.read("../res/questions.json");
    const check = new ChecklistHandler();

    let params = new URLSearchParams(window.location.search);
    check.sendScore(params.get("score"));
    let tips = params.get("tips");
    if(tips !== "") check.sendTips(tips.split(","));
}