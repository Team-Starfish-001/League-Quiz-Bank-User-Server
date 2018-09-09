function dialogCreate() {
    console.log("Creating Dialog!");
    var content = document.getElementById('content');
    content.innerHTML = "<div id=\'panel\'><div id=\'interior_panel\'><input placeholder=\'Untitled Quiz\'><div id=\'box_break\'></div><div id=\'holder\'><button id=\'panel_exit\' onclick='dialogExit()'>Exit</button><button id=\'panel_create\'>Create</button></div><textarea placeholder=\'Quiz Description\'></textarea></div></div>";
    var tint_cover = document.getElementById('tint_cover');
    tint_cover.style = "position: absolute;background-color: rgba(0, 0, 0, 0.8);padding-bottom: 100%;padding-right: 100%;top: 0;z-index: 1;";   
}
function dialogExit() {
    var content = document.getElementById('content');
    content.innerHTML = "";
    var tint_cover = document.getElementById('tint_cover');
    tint_cover.style = "";
}