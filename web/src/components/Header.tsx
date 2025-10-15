export default function Header() {
  return (
    <header className="flex justify-between items-center shadow-xl">
      <div className="bg-landing">
        <p className="italic px-10 py-5 text-white font-bold text-xl">
          Goweb<span className="text-red-500">.</span>
        </p>
      </div>
      <a
        href="#"
        className="bg-red-500 px-10 py-5 font-bold text-white text-xl"
      >
        Contact
      </a>
    </header>
  );
}
