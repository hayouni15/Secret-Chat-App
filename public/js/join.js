const $joinBtn=document.querySelector('#Join')

$joinBtn.addEventListener('click',()=>{
    const $room=document.querySelector('#room').value
const $user=document.querySelector('#username').value
 
   window.open(`/chat.html?room=${$room}&&username=${$user}`);
})