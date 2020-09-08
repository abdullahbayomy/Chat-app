const socket = io()

///Elements
const $messageForm = document.querySelector('#messages-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

///templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

///options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) ///get them from query string

const autoScroll = ()=>{
     ///new message element
     const $newMessage = $messages.lastElementChild
     ///Hieght of new message
     const newMessageStyles = getComputedStyle($newMessage) /// to get the margin value
     const newMessageMargin =2* parseInt(newMessageStyles.marginBottom)      /// convert string number to int
     const newMessageHeight = $newMessage.offsetHeight +  newMessageMargin
     /// visible hight
     const visibleHeight = $messages.offsetHeight
     /// height of messages container 
     const containrHeight = $messages.scrollHeight
     /// how far i scrolled
     const scrollOfset = $messages.scrollTop + visibleHeight

     if(containrHeight - newMessageHeight <= scrollOfset){
         $messages.scrollTop = $messages.scrollHeight
     }
}


socket.on('sending message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {

        username:message.username, 
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
       users    
    })
    document.querySelector('#sidebar').innerHTML=html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')


    message = e.target.elements.message.value
    socket.emit('sending message', message, (error) => {

        /// Unpause the button.. clear the message.. give the form the focus back 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return alert (error)
        }
        console.log('Message Delivered! ')
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})