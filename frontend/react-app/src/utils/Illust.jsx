function Person({ color, hair }) {
  return (
  <div className="person">
    <div className="head">
      <div className="hair" style={{ background: hair }} />
          <div className="face">
            <i/><i/><b/>
          </div>
      </div>
    <div className="shirt" style={{ background: color }} />
  </div>
  )
}

export default function Illust() {
    return (
        <div className="illustration">
            <div className="stripe s1" /><div className="stripe s2" />
            <div className="visual-title"><i />Your meetings, connected.</div>
            <div className="dots">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>
            <div className="ring" />
            <div className="screen main-screen"><Person color="#147b87" hair="#f4bd55" /></div>
            <div className="screen small-screen"><Person color="#ffbe38" hair="#343748" /></div>
            <div className="quote"><p>"Meet face-to-face,<br />even when you're miles apart."</p></div>
        </div>
    )
}