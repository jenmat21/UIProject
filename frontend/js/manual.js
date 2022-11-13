console.log("JS Loaded");

//backpage
function backPage() {
    window.location.href = "./home.html";
}

document.getElementById("backButton").addEventListener("click", backPage);