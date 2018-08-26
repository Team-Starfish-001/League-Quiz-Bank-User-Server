window.addEventListener('resize',pageSize);
var start = 673;
var textsize = "24px";
function pageSize() {
    var headtextstyle = window.document.getElementById('head_text');
    if(window.innerWidth < 673) {
        headtextstyle.style.fontSize = "23px";
    }
    if(window.innerWidth < 651) {
        headtextstyle.style.fontSize = "22px";
        
    }
    else {
        headtextstyle.style.fontSize = textsize;
    }
}