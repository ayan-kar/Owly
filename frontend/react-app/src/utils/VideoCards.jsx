
import "../App.css";
export default function VideoCard({ className, person, role, color }) {
  return (
    <div className={`video-card ${className}`} style={{ "--card": color }}>
      <div className="card-top">
        <span className="live-dot" />
        <span>{role}</span>
      </div>
      <div className="person">
        <div className="avatar" aria-hidden="true">
          <div className="hair" />
          <div className="face">
            <span className="eye left" />
            <span className="eye right" />
            <span className="smile" />
          </div>
          <div className="shirt" />
        </div>
        <div className="person-name">{person}</div>
      </div>
      <div className="chat-bubble">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}