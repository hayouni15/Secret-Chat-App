var users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        console.log('User name and room are required')
        return {
            error: 'User name and room are required',user:undefined
        }
    }
    //check for xisting users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (existingUser) {
        console.log('existing user')
        return {
            error: 'user name is in use ',user:undefined
        }
    }
    const user = { id, username, room }
    users.push(user)
    return {user,error:undefined}

}

const removeUser = (id) => {
    var filtered = []

    filtered=users.filter((user)=>{
        return user.id===id
    })
    users=users.filter((user)=>{
        return user.id!==id
    })
return filtered

}

const getUser=(id)=>{
    return users.find((user)=>{
        return user.id===id
    }) 
}
const getUsersInRoom=(room)=>{
    return users= users.filter((user)=>{
        return user.room===room
    })

}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

