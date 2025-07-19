if (localStorage.getItem('password')) {
    insertPlainHTML(atob(localStorage.getItem('password')))
} else {
    document.getElementById('staticrypt-form').addEventListener('submit', function(e) {
        e.preventDefault();
        insertPlainHTML(document.getElementById('staticrypt-password').value);
    });
}