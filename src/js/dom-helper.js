var createElement = innerHTML =>{
    var element = document.createElement("fragment");
    element.innerHTML = innerHTML;
    return element.firstChild;
}

export {
    createElement
}