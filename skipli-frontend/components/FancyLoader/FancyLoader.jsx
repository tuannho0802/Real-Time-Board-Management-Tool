import "./FancyLoader.css";

export default function FancyLoader() {
  return (
    <div className="loader mx-auto my-16">
      <div className="box">
        <div className="logo">
          <img
            src="/logo.svg"
            alt="Skipli Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
    </div>
  );
}
