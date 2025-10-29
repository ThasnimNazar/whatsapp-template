import "../css/Preview.css";

const Preview = ({ message }) => {
  return (
    <div className="phone-frame">
      <div className="whatsapp-screen">
        <div className="chat-bubble">
          {message.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
