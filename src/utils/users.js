const users=[]
const addUser = ({id, username, room})=>{
    
    username = username.trim()
    room = room.trim()

    if(!username || !room)
        return {error: 'User Name & Room Are Required'}

    const existingUser=users.find((user)=>{
        return user.room==room && user.username ==username
    })

    if(existingUser)
        return {error:'User Name Is In Use'} 

    const user = {id, username, room}
    users.push(user)

    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id ===id )

    if(index!==-1)
        return users.splice(index,1)[0]
}

const getUser = (id)=>{
    return users.find((user)=>user.id===id)
}

const getUsersInRoom = (room)=>{
    room = room.trim()
    return users.filter((user)=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}