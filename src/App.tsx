import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { obtenerLibros, obtenerCapitulos, obtenerContenidoCapitulo } from "./lib/biblia-api";
import type { Libro, Capitulo } from "./lib/tipos";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Book, ChevronLeft } from "lucide-react";
import Login from "./pages/Login";

function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [capitulos, setCapitulos] = useState<Capitulo[]>([]);
  const [capituloSeleccionado, setCapituloSeleccionado] = useState<Capitulo | null>(null);
  const [contenidoCapitulo, setContenidoCapitulo] = useState<string>("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCargandoSesion(false);
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      cargarLibros();
    }
  }, [session]);

  const cargarLibros = async () => {
    setCargando(true);
    setError(null);
    try {
      const librosObtenidos = await obtenerLibros();
      setLibros(librosObtenidos);
    } catch (error) {
      setError("Error al cargar los libros");
    } finally {
      setCargando(false);
    }
  };

  const seleccionarLibro = async (libro: Libro) => {
    setLibroSeleccionado(libro);
    setCapitulos([]);
    setCapituloSeleccionado(null);
    setContenidoCapitulo("");

    setCargando(true);
    try {
      const capitulosObtenidos = await obtenerCapitulos(libro.id);

      // Asegurar que los capítulos tengan números en secuencia
      const capitulosOrdenados = capitulosObtenidos.map((cap, index) => ({
        ...cap,
        numero: (index + 1).toString(),
      }));

      setCapitulos(capitulosOrdenados);
    } catch (error) {
      setError("Error al cargar los capítulos");
    } finally {
      setCargando(false);
    }
  };

  const seleccionarCapitulo = async (capitulo: Capitulo) => {
    setCapituloSeleccionado(capitulo);
    setContenidoCapitulo("");

    setCargando(true);
    try {
      const contenido = await obtenerContenidoCapitulo(capitulo.id);
      setContenidoCapitulo(contenido);
    } catch (error) {
      setError("Error al cargar el contenido del capítulo");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoSesion) {
    return <div className="text-center text-indigo-600 text-lg mt-10">Cargando sesión...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <header className="bg-indigo-600 text-white rounded-t-lg p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Book className="w-6 h-6 mr-2" /> Santa Biblia
          </h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md flex items-center hover:bg-gray-200 transition"
          >
            <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
          </button>
        </header>

        <div className="p-6">
          {error && <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>}

          {!libroSeleccionado && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Libros</h2>
              <ul className="grid grid-cols-2 gap-2">
                {libros.map((libro) => (
                  <li key={libro.id}>
                    <button
                      onClick={() => seleccionarLibro(libro)}
                      className="w-full bg-indigo-100 hover:bg-indigo-200 p-3 rounded-md transition"
                    >
                      {libro.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {libroSeleccionado && !capituloSeleccionado && (
            <div>
              <button
                onClick={() => setLibroSeleccionado(null)}
                className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Volver a libros
              </button>
              <h2 className="text-lg font-semibold mb-4">Capítulos de {libroSeleccionado.name}</h2>

              <ul className="grid grid-cols-4 gap-2">
                {capitulos.map((capitulo) => (
                  <li key={capitulo.id}>
                    <button
                      onClick={() => seleccionarCapitulo(capitulo)}
                      className="w-full bg-indigo-100 hover:bg-indigo-200 p-3 rounded-md transition"
                    >
                      {capitulo.numero}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

{capituloSeleccionado && contenidoCapitulo && (
  <div className="mt-6">
    <button
      onClick={() => setCapituloSeleccionado(null)}
      className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition"
    >
      <ChevronLeft className="w-4 h-4 mr-2" /> Volver a capítulos
    </button>
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      {libroSeleccionado?.name} - Capítulo {capituloSeleccionado?.numero}
    </h2>
    <div className="bg-[#f4ecd8] p-6 rounded-md shadow-lg text-lg leading-relaxed max-w-3xl mx-auto text-gray-900">
      {contenidoCapitulo.split(/\[(\d+)\]/).map((fragmento, index) =>
        index % 2 === 0 ? (
          <span key={index}>{fragmento}</span>
        ) : (
          <span key={index} className="font-bold text-indigo-700 mr-1">
            {fragmento}
          </span>
        )
      )}
    </div>
  </div>
)}

        </div>
      </div>
    </main>
  );
}

export default App;
