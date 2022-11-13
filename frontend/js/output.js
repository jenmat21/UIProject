console.log("JS Loaded");

//On load
let score = sessionStorage.getItem("score");
const bgBar = document.getElementById("rangeBackground")
bgBar.style.setProperty("width", "calc(" + score * 85 + "% + " + 4.4 * score + "em)");
document.getElementById("scoreNum").innerHTML = score * 100 + "%";

//load accessibility tips


//backpage
function backPage() {
    window.location.href = "./home.html";
}

document.getElementById("backButton").addEventListener("click", backPage);