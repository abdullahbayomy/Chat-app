///Elements
const $sendLocationButton = document.querySelector('#send-Location') 
///templates
const locationTemplate = document.querySelector('#location-template').innerHTML

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
      return allert('Geolocation is not supported by your browser')
    } 
    /// disable to button tell the data is sent
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition( (position)=>  {

        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            /// inable to button tell the data is sent
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared! ')
        })
    })      
})

socket.on('locationMessage', (message) => {
    console.log(message)
    
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format("h:mm a") 
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})