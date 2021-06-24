const chatForm = document.getElementById('chat-form');

const socket = io() ;

socket.on('message', message => {
    console.log(message)
});

//message submit 
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value ;
    //Emit message to server
    socket.emit('chatMessage',msg)

    console.log(msg);
});

//Output message to DOM 

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add(div);
    div.innerHTML = ` <p class="meta"> Taz <span>9:12pm</span></p>
    <p class="text"> 
    ${message}
    </p>
    `;

}