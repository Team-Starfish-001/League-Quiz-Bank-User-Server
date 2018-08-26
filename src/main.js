console.log('Lift off in 3... 2.... 1');
window.addEventListener('resize',pageSize);
var originalWidth = '75%';
function pageSize() {
    var leagueImageMaxWidth = 1200;
    var windowWidth = window.innerWidth;
    var leagueImage = window.document.getElementById('league_picture');
    //540
    if(windowWidth > leagueImageMaxWidth) {
        leagueImage.style.width = '540px';
    }
    else {
        leagueImage.style.width = originalWidth;
    }
}