
const socket = io()

const $messageInput = document.querySelector('#message')
const $messageSendBtn = document.querySelector('#send')
const $messageSendLocationBtn = document.querySelector('#sendLocation')
const $messageDisplay = document.querySelector('#messageDisplay')
const $messagebuffering = document.querySelector('#buffering')
const $userslist= document.querySelector('#usersList')
const $Roomname=document.querySelector('#Roomname')

const {room, username}=Qs.parse(location.search,{ignoreQueryPrefix:true})

$messageInput.addEventListener('focus', () => {
    console.log('focused')
    socket.emit('typing', 'start')
})
$messageInput.addEventListener('focusout', () => {
    console.log('focuseout')
    socket.emit('typing', 'end')
})

socket.on('message', (data) => {
    var sender=(data.sender) ? data.sender:'server'
    console.log(data)
    $messageDisplay.insertAdjacentHTML('beforeend', `<div id='oneMsg'><p id='themessage'>${sender}:${data.message}</p><p id='time'>${data.time}</p></div>`);
    const element=$messageDisplay.lastElementChild
    element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
})

socket.on('list',(list)=>{
    $userslist.innerHTML=('');
  
    const thelist=Object.entries(list)
    console.log(thelist)
    $Roomname.innerHTML=(thelist[0][1].room)
    thelist.forEach((user)=>{
        console.log(user[1].id)
        $userslist.insertAdjacentHTML('afterbegin', `<li name="user 1">${user[1].username}</li>`);

    })
    
})


socket.on('join',(data)=>{
    //$userslist.insertAdjacentHTML('afterbegin',`<li name="${data.user}">${data.user}</li>`)
    $messageDisplay.insertAdjacentHTML('afterbegin', `<div id='oneMsg'><p id='themessage'>${data}</p></p></div>`);
})

socket.on('typing', (data) => {
    if (data === 'start') {
        $messagebuffering.innerHTML = '...'
    }
    else {

        $messagebuffering.innerHTML = ''
    }

})
socket.on('location', (data) => {
    console.log(data)
    $messageDisplay.insertAdjacentHTML('afterbegin', `<a href="${data.data}" target="blanks" >${data.user}:this is my location</a>`);
   
})


document.querySelector('#send').addEventListener('click', () => {
    const msg = document.querySelector('#message').value
    $messageSendBtn.setAttribute('disabled', 'disabled')
    socket.emit('msg', msg, (mesg) => {
        $messageSendBtn.removeAttribute('disabled')
        $messageInput.value = ''
        $messageInput.focus()
        $messageDisplay.insertAdjacentHTML('beforeend', `<div id='oneMsg'><p id='mytime'>${mesg}</p><p id='mymessage'>${msg}</p></div>`);
        console.log(mesg)
        const element=$messageDisplay.lastElementChild
        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    })

})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported ')
    }
    $messageSendLocationBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`, (msg) => {
            $messageSendLocationBtn.removeAttribute('disabled')
            console.log(msg)
        })
    })
})

socket.emit('join',{room,username},(data)=>{

    if(data.error){
        alert(data.error)
        location.href='/'}

})