export function Buttom({ type, style, text, title, onClick= null}) {
  return (
    <button type={type} className={`btn traslation ${style}`} title={title} onClick={onClick}>
      {text}
    </button>
  );
}
