var selectedElement = null;
var currentX = 0;
var originalX = 0;
var originalY = 0;
var oldCursor = null;
var globalStyle = document.getElementsByTagName("svg")[0].style;
var ghost = document.getElementById('ghost');
var rectTransform = null;

var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();
realXToViewboxX = function (x) {
    pt.x = x;
    pt.y = 0;
    return pt.matrixTransform(svg.getScreenCTM().inverse()).x;
};

Array.from(document.querySelectorAll('.data-po-body')).forEach(function(poBody){
    poBody.addEventListener('mouseup', deselectElement);
});
document.querySelector('svg').addEventListener('mouseup', deselectElement);
document.querySelector('svg').addEventListener('mousemove', moveElement);

function selectElement(evt) {
    selectedElement = evt.target;
    adaptGhost(selectedElement.parentNode);
    ghost.style.display = 'block';

    // Getting
    var xforms = ghost.getAttribute('transform');
    var translation = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
    originalX = parseFloat(translation[1]);
    originalY = parseFloat(translation[2]);
    cursorX = realXToViewboxX(evt.clientX) - originalX;

    oldCursor = globalStyle.cursor
    globalStyle.cursor = "ew-resize"
}
function moveElement(evt){
    if(selectedElement != null) {
        evt.preventDefault();
        var dx = realXToViewboxX(evt.clientX) - originalX - cursorX;
        transform(ghost, originalX + (25 * Math.round(dx/25)), originalY);
    }
}
function deselectElement(evt){
    if(selectedElement != null){
        ghost.style.display = 'none';
        selectedElement.removeAttributeNS(null, "onmouseup");
        var dx = realXToViewboxX(evt.clientX) - originalX - cursorX;
        transform(selectedElement.parentNode, originalX + (25 * Math.round(dx/25)));
        selectedElement = null;
        globalStyle.cursor = oldCursor
    }
}
function transform(element, translateX) {
    element.setAttribute("transform", "translate(" + translateX + "," + originalY + ") ");
}
function adaptGhost(element) {
    ghost.setAttribute("transform", element.getAttribute("transform"));
    rectTransform = element.querySelector('.data-po-body').getAttribute("transform");
    ghost.querySelector('.data-po-body').setAttribute("transform", rectTransform);
}