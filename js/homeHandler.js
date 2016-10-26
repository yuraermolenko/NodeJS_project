window.onload = () => {
    var ul = document.getElementsById('category list');
    ul.onclick = (e) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'home/' + e.target.dataset.category);
        xhr.send(); 
        //xhr.onload = function () {
        //    location.href = 'http://localhost:1337/edit/' + e.target.parentNode.id;
        //}
    }
}
