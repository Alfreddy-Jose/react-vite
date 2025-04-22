export function Buttom({type, style, text, title}) {
  return (
    <button type={type} className={`btn ${style}`} title={title} >
      {text}
    </button>
  );
}
