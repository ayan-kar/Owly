import { Server } from "socket.io"

let connections = {}
//~ it will look like this
// {
//   "room1": ["socketId1", "socketId2"],
//   "room2": ["socketId3"]
// }

let messages = {}  //$ This wiil storing chat history per room
//~ it will look like this
// {
//   "room1": [
//     {
//       sender: "Alice",
//       data: "hello",
//       "socket-id-sender": "abc123"
//     }
//   ]
// }

let timeOnline = {} //$  will stores when each socket joined


export const connectToSocket = (server) => {
        const io = new Server(server, {
                cors: {
                        origin: "*",
                        methods: ["GET", "POST"],
                        allowedHeaders: ["*"],
                        credentials: true
                }
        }) //$ Socket.IO is not an HTTP server .
        //$ io is a real-time event layer. It needs an actual HTTP server to attach to

        io.on("connection", (socket) => {
                console.log("something is connected")

                socket.on("join-call", (path) => {      //$ joining in room or call ,path is the roomID or the url
                        if (connections[path] == undefined) { //! could improve by socket.join
                                connections[path] = []   //$ create  an empty array for that path
                        }
                        connections[path].push(socket.id) //$ pushing current socket id to the connections object
                        timeOnline[socket.id] = new Date()


                        for (let i = 0; i < connections[path].length; i++) {  //$ telling every id (including the sender) on that call that a user joined
                                io.to(connections[path][i]).emit("user-joined", socket.id, connections[path]) //! can optimize
                        }
                        if (messages[path] != undefined) {   //$ if there are any messages in the room
                                for (let i = 0; i < messages[path].length; i++) { //$ sending all the messages to the new user
                                        io.to(socket.id) //$ server sending all msg
                                                .emit("chat-messages", messages[path][i]["data"],
                                                        messages[path][i]["sender"],
                                                        messages[path][i]["socket-id-sender"])
                                }
                        }

                })

                socket.on("signal", (toId, message) => { //$ WebRTC peers exchange connection info (offers/answers/ICE candidates)
                        io.to(toId).emit("signal", socket.id, message); //$  "Send an event called signal to toId, and include socket.id (my own ID) and message as the two pieces of data in that event.
                })

                //! can optimize with socket rooms
                socket.on("chat-message", (data, sender) => {  //$ when a message comes in, it manually searches the sender, through every room in connections
                        const [matchingRoom, found] = Object.entries(connections) //$ it is sallow copy (a reference)
                                .reduce(
                                        ([room, isFound], [roomKey, roomValue]) => {
                                                if (!isFound && roomValue.includes(socket.id)) {//$ isFound matters (the "don't overwrite once found" guard)
                                                        return [roomKey, true]
                                                }
                                                return [room, isFound];

                                        }, ['', false])   // <-- starting value of the accumulator

                        if (found == true) {
                                if (messages[matchingRoom] == undefined) {
                                        messages[matchingRoom] = []
                                }
                                messages[matchingRoom].push({
                                        'sender': sender,
                                        "data": data,
                                        "socket-id-sender": socket.id
                                })
                                console.log("message", matchingRoom, ":", sender, data)
                                connections[matchingRoom].forEach(element => {
                                        io.to(element).emit("chat-message", data, sender, socket.id)
                                });
                        }

                })
                socket.on("disconnect", () => {
                        var diffTime = Math.abs(timeOnline[socket.id] - new Date())
                        console.log(diffTime)
                        var key
                        for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) { //$ it is a deep copy (not effecting original)

                                for (let a = 0; a < v.length; a++) {
                                        if (v[a] == socket.id) {
                                                key = k
                                                for (let a = 0; a < connections[key].length; a++) {
                                                        io.to(connections[key][a]).emit('user-left', socket.id)
                                                }

                                                var index = connections[key].indexOf(socket.id) //$ finding the soekt id in key or room
                                                connections[key].splice(index, 1)
                                                if (connections[key].length == 0) { //$ Room cleanup: if removing this socket left the room completely empty
                                                        delete connections[key]
                                                }
                                        }

                                }
                        }

                })

        })

        return io;
}




//~ Object.entries(connections) This converts the object into an array of [key, value] pairs
// [
//   ["room1", ["socketA", "socketB"]],    (roomKey is roomID and roomValue is the collection of sockets)
//   ["room2", ["socketC"]]
// ]