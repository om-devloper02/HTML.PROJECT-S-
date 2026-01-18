document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert('Thank you for contacting us, ' + name + '!');
            form.reset();
        } else {
            alert('Please fill out all fields.');
        }
    });
});

const text = "Welcome to Shreeyash Technical Campus";
let index = 0;

function animateText() {
    document.querySelector('.typed-text-output').textContent = text.substring(0, index);
    index = (index + 1.05) % (text.length + 4); // Reset index to 0 when it reaches the end
}

setInterval(animateText, 200); // Adjust timing as needed