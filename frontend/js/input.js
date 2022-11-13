console.log("JS Loaded");

//Load questions here


//sample score
let score = .83;

function submit() {
    //process form data
    
    
    sessionStorage.clear();
    sessionStorage.setItem("score", score);

    window.location.href = "./output.html";
}

//clears all inputs
function clear() {
    for(var form of document.forms) {
        for(var element of form.elements) {
            element.checked = false;
        }
    }
}

//loads manual
function manual(){
    window.location.href = "./manual.html";
}

document.getElementById("helpButton").addEventListener("click", manual);
document.getElementById("clear").addEventListener("click", clear);
document.getElementById("submit").addEventListener("click", submit);