document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var instagramUrl = 'https://www.instagram.com/' + username;
    var qr = new QRious({
        element: document.getElementById('qrCode'),
        value: instagramUrl,
        size: 200,
    });
});
