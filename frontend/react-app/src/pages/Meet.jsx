import "../Lobby.css"
import NavBar from "../utils/NavBar";
const server_uri = import.meta.env.VITE_BASE_SERVER_URL

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

var connections = {}
//$ { remoteSocketId: RTCPeerConnection } 
//$ my phone line to each other person

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

function Person({ color, hair }) {
    return (
        <div className="person">
            <div className="head">
                <div className="hair" style={{ background: hair }} />
                <div className="face">
                    <i /><i /><b />
                </div>
            </div>
            <div className="shirt" style={{ background: color }} />
        </div>
    )
}

function LobbyIllust({ localVideoRef, videoAvailable }) {
    return (
        <div className="illustration">
            <div className="stripe s1" /><div className="stripe s2" />
            <div className="visual-title"><i />Your meetings, connected.</div>
            <div className="dots">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>
            <div className="ring" />
            <div className="screen main-screen">
                {console.log("ok", videoAvailable)}

                {
                    videoAvailable ?
                        <video ref={localVideoRef} autoPlay muted style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",

                        }} /> : <Person color="#147b87" hair="#f4bd55" />
                }
            </div>
            <div className="screen small-screen"><Person color="#ffbe38" hair="#343748" /></div>
            <div className="quote"><p>"Meet face-to-face,<br />even when you're miles apart."</p></div>
        </div>
    )
}

export default function MeetCompo() {

    var socketIdRef = useRef(); //* my own socket id
    var socketRef = useRef(); //* for holding the total connection of socket io (this is what you call .emit on)
    let localVideoRef = useRef(); //* for my video


    const videoRef = useRef([])//* a mirror copy of the videos array 


    let [videos, setVideos] = useState([]) //*An array that will hold, the remote streams of other users, who join the room (stale closure)

    let [videoAvailable, setVideoAvailable] = useState();
    let [audioAvailable, setAudioAvailable] = useState();
    let [ScreenAvailable, setScreenAvailable] = useState();
    //* for checking if video and audio and screen is available hardware wise


    let [video, setVideo] = useState(); //* for toggle bw video off on
    let [audio, setAudio] = useState() //* for toggle bw audio off on
    let [screen, setScreen] = useState() //* or toggle bw screenSharing off on

    let [Modal, setModal] = useState()

    let [Messages, setMessages] = useState() //* all msg form others
    let [Message, setMessage] = useState() //* my own message
    let [NewMessage, setNewMessage] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true); //*  If true, the lobby shows the "Enter your username" screen. 
    let [username, setUserName] = useState("")


    const getPermission = async () => {  //^ DONE
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                // videoPermission.stream.getTracks().forEach(t => t.stop())
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                // audioPermission.stream.getTracks().forEach(t => t.stop())
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia(
                    {
                        video: videoAvailable,
                        audio: audioAvailable
                    });
                if (userMediaStream) {
                    window.localStream = userMediaStream; ///* stores my stream on the global window
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                        //* srcObject: a video element's property that accepts a MediaStream (a live camera feed)
                    }
                }
            }
        } catch (error) {
            console.log("error ocuured in getpermission Block ",error);
        }
    } 

    useEffect(() => {  //~ 1st execution  
        //^ DONE
        getPermission();
    }, []) //* only on a page reload it will ask for permission again


     //* reflect the  changes to others when user on off audio video
   
    
        let getUserMediaSuccess = (stream) => {  //~ 4th execution 
        try {
            window.localStream.getTracks().forEach(track => { //* stop the old stream and show the new one
                track.stop()
            })
        } catch (e) {
            console.log(e)
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue; //* for me it wont run

            connections[id].addStream(window.localStream) //* adding my stream to that id for sharing
            connections[id].createOffer().then((description) => { //* doing initial handshake as he media changed, so I must send a new offer (SDP) to that peer. This is called renegotiation.
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    }).catch(e => { console.log(e) })
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false)
            setAudio(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    //^ DONE
    let silence = () => { //* A disabled audio track sends silence
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    
   //^ DONE
    let black = ({ width = 640, height = 480 } = {}) => { //* disabled video track sends black frames.
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    //^ DONE
    let getUserMedia = () => {  //$  whenever the user toggles their video/audio on or off
        //~ 3rd excution , as we got A&V permission already in 1st excution
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({
                video: video,
                audio: audio
            }).then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());

            } catch (error) {

            }
        }
    }
    //^ DONE
    useEffect(() => {
        if (video != undefined && audio != undefined) //! confusion
            getUserMedia() //~ 5th execution
    }, [audio, video])

    //^ DONE
    let connect = () => {  //~ when user click on join ,so it is the 2nd excution
        setAskForUsername(false);
        getMedia();
    }
    //^ DONE
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer(); //~ 6th Excution
    }

    let addMessage = () => {

    }

    let connectToSocketServer = () => {  //~ 7th Excution
        socketRef.current = io.connect(server_uri, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer) // $ catching signal form line 62 socektManager

        socketRef.current.on("connect", () => { 

            socketIdRef.current = socketRef.current.id

            socketRef.current.emit("join-call", window.location.href)
            
            socketRef.current.on("chat-message", addMessage)

        
        socketRef.current.on("user-left", (id) => {
            setVideos((videos) => videos.filter((video) => video.socketId != id))
        })

        socketRef.current.on("user-joined", (id, clients) => {
            clients.forEach((socketListId) => {
                connections[socketListId] = new RTCPeerConnection(peerConfigConnections) //$ returning and storing a connection to each peers.
                connections[socketListId].onicecandidate = (event) => {
                    if (event.candidate != null)
                        socketRef.current.emit("signal", socketListId, JSON.stringify({ "ice": event.candidate })) //$ sending my public ip to node server 
                }
                connections[socketListId].onaddstream = (event) => {
                    let videoExists = videoRef.current.find(video => video.socketId == socketListId);
                    if (videoExists) {
                        setVideos(videos => {
                            const updateVideos = videos.map(video =>
                                video.socketId == socketListId ? { ...video, stream: event.stream } : video
                            )
                            videoRef.current = updateVideos;
                            return updateVideos;
                        })
                    }

                    else {

                        let newVideo = {
                            socketId: socketListId,
                            stream: event.stream,
                            autoPlay: true
                        }
                        setVideos(videos => {
                            const updateVideos = [...videos, newVideo];
                            videoRef.current = updateVideos;
                            return updateVideos;
                        })
                    }
                };

                if (window.localStream != undefined && window.localStream != null) {
                    connections[socketListId].addStream(window.localStream)
                } else {
                    let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                    window.localStream = blackSilence();
                    connections[socketListId].addStream(window.localStream);
                }
            })
            if (id === socketIdRef.current) {
                for (let id2 in connections) {
                    if (id2 == socketIdRef.current) continue
                    try {
                        connections[id2].addStream(window.localStream)
                    } catch (error) {

                    }
                    connections[id2].createOffer().then((description) => {
                        connections[id2].setLocalDescription(description)
                            .then(() => {
                                socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                            })
                            .catch(e => console.log(e))
                    })
                }
            }
        })
          })
    };

    let gotMessageFromServer = (fromId, message) => {  //$ This is the client-side counterpart to the signal 
        var signal = JSON.parse(message)
        if (fromId != socketIdRef.current) { // $this signal didn't come from myself
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit("signal", fromId, JSON.stringify(
                                        { "sdp": connections[fromId].LocalDescription }))
                                })
                                    .catch(e => console.log(e))
                            }).catch(e => console.log(e))
                        }
                    }).catch(e => {
                        console.log(e)
                    })
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }

    }



    return (
        <div>
            <NavBar />
            <main className="page">
                <section className="shell">
                    <div className="form-panel">
                        <div className="form-area">
                            <p className="eyebrow">
                                READY TO CONNECT ON OWL
                            </p>
                            <h1>Let's get Your <br />Name First.</h1>

                            <p className="subtext"></p>
                            <br />
                            <br />
                            <form action="" method="post">
                                <label htmlFor="username"><h2>Username</h2>  &nbsp;&nbsp;&nbsp;</label>
                                <input id="username" type="text" placeholder="Username" name="username" value={username}
                                    onChange={(e) => {
                                        setUserName(e.target.value)
                                    }}
                                    required />
                                <br />

                                <button onClick={connect} className="login-btn" type="submit" >JOIN </button>
                            </form>
                        </div>
                    </div>
                    <div className="visual-panel">
                        <LobbyIllust videoAvailable={videoAvailable} localVideoRef={localVideoRef} />
                    </div>
                </section>
            </main>
        </div>
    )

}