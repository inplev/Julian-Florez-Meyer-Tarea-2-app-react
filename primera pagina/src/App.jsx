import { Routes, Route, NavLink, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

function Inicio() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usuarios, setUsuarios] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuarios")) ?? []; } catch { return []; }
  });
  const [errores, setErrores] = useState({});

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const guardar = (l) => localStorage.setItem("usuarios", JSON.stringify(l));

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre obligatorio";
    if (!email.trim()) e.email = "Email obligatorio";
    else if (!emailRx.test(email)) e.email = "Email inválido";
    if (!telefono.trim()) e.telefono = "Teléfono obligatorio";
    if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      e.email = "Ya existe un usuario con este email";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    const nuevo = { id: crypto.randomUUID(), nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim() };
    const lista = [...usuarios, nuevo];
    setUsuarios(lista); guardar(lista);
    setNombre(""); setEmail(""); setTelefono("");
  }

  function eliminar(id) {
    const lista = usuarios.filter(u => u.id !== id);
    setUsuarios(lista); guardar(lista);
  }

  return (
    <section className="card">
      <h2>Inicio</h2>
      <form onSubmit={onSubmit} noValidate className="form form-narrow">
        <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)}
          className={errores.nombre?"error":""} />
        {errores.nombre && <small className="error-text">{errores.nombre}</small>}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          className={errores.email?"error":""} />
        {errores.email && <small className="error-text">{errores.email}</small>}
        <input placeholder="Teléfono" value={telefono} onChange={e=>setTelefono(e.target.value)}
          className={errores.telefono?"error":""} />
        {errores.telefono && <small className="error-text">{errores.telefono}</small>}
        <button type="submit" className="btn">Registrar</button>
      </form>

      <h3>Usuario que han sido registrados</h3>
      {usuarios.length === 0 ? <p>Aun no hay usuarios registrados</p> : (
        <ul className="list">
          {usuarios.map(u => (
            <li key={u.id}>
              <span>{u.nombre} - {u.email} - {u.telefono}</span>
              <button onClick={()=>eliminar(u.id)} className="btn-small">X</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QuienesSomos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!r.ok) throw new Error("Error al cargar");
        setData(await r.json());
      } catch (e) { setError(String(e)); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <section>
      <h2>Quiénes somos</h2>
      <div className="grid">
        {data.map(u => (
          <Link key={u.id} to={`/quienes-somos/${u.id}`} className="card user-card">
            <h3>{u.name}</h3>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Tel:</strong> {u.phone}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function UsuarioDetalle() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!r.ok) throw new Error("No encontrado");
        setU(await r.json());
      } catch (e) { setError(String(e)); } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <section className="card">
      <h2>{u.name}</h2>
      <p><strong>Email:</strong> {u.email}</p>
      <p><strong>Tel:</strong> {u.phone}</p>
      <Link to="/quienes-somos">← Volver</Link>
    </section>
  );
}

function Mensaje({ nombre, id, urlimg }) {
  return (
    <section className="card">
      <h2>Mensaje</h2>
      <p>Bienvenido esta es la tarea de {nombre}. Tu id es {id}.</p>
      {urlimg && <img src={urlimg} alt="img" style={{maxWidth:300}}/>}
    </section>
  );
}

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    color: "#fff", textDecoration: "none", borderRadius: 6, padding: "6px 10px",
    background: isActive ? "#444" : "transparent"
  });
  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-left">
          <NavLink to="/" className="brand">Julian Florez Pag React</NavLink>
        </div>
        <div className="nav-right nav-links">
          <NavLink to="/" end style={linkStyle}>Inicio</NavLink>
          <NavLink to="/quienes-somos" style={linkStyle}>Quiénes somos</NavLink>
          <NavLink to="/mensaje" style={linkStyle}>Mensaje</NavLink>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Mi App React - Todos los derechos reservados</p>
        <p>Contacto: julian@example.com | Tel: +57 300 123 4567</p>
        <div className="socials">
          <a href="https://instagram.com" target="_blank">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/quienes-somos/:id" element={<UsuarioDetalle />} />
          <Route path="/mensaje" element={<Mensaje nombre="Julian Florez Meyer" id={132} urlimg="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcR8uJdMfMvOeZMYrTdPlwXYumnmYEZhYBeg&s" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

