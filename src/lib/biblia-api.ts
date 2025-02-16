const API_KEY = import.meta.env.VITE_BIBLE_API_KEY;
const API_URL = "https://api.scripture.api.bible/v1/bibles";
const BIBLE_ID = "592420522e16049f-01"; // Reina Valera 1909

import type { Libro, Capitulo } from "./tipos";

// 📌 Cache para libros y evitar llamadas innecesarias
let librosCache: Libro[] | null = null;

// 📌 Función para obtener los headers de la API
const getHeaders = () => {
  if (!API_KEY) {
    console.error("⚠️ Error: API_KEY no está definida");
    throw new Error("API_KEY no está definida");
  }
  return {
    "api-key": API_KEY,
    "Content-Type": "application/json",
  };
};

// 📌 Verifica si la API está disponible antes de hacer fetch
export async function verificarAPI(): Promise<boolean> {
  try {
    const response = await fetch(API_URL, { headers: getHeaders() });
    return response.ok;
  } catch (error) {
    console.error("⚠️ La API no responde:", error);
    return false;
  }
}

// 📌 Obtener la lista de libros de la Biblia (usa caché)
export async function obtenerLibros(): Promise<Libro[]> {
  if (librosCache !== null) return librosCache as Libro[];

  try {
    console.log("📖 Obteniendo libros...");

    const response = await fetch(`${API_URL}/${BIBLE_ID}/books`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los libros: ${response.statusText}`);
    }

    const data = await response.json();
    librosCache = data.data || [];
    console.log("📚 Libros obtenidos:", librosCache);

    return librosCache!;
  } catch (error) {
    console.error("⚠️ Error al obtener los libros:", error);
    return [];
  }
}

// 📌 Obtener los capítulos de un libro específico
export async function obtenerCapitulos(libroId: string): Promise<Capitulo[]> {
  try {
    console.log(`📖 Obteniendo capítulos del libro: ${libroId}`);

    const response = await fetch(`${API_URL}/${BIBLE_ID}/books/${libroId}/chapters`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los capítulos: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📑 Capítulos obtenidos:", data.data);

    return data.data || [];
  } catch (error) {
    console.error(`⚠️ Error al obtener los capítulos de ${libroId}:`, error);
    return [];
  }
}

// 📌 Obtener el contenido de un capítulo
export async function obtenerContenidoCapitulo(capituloId: string): Promise<string> {
  try {
    console.log(`📖 Obteniendo contenido del capítulo: ${capituloId}`);

    const response = await fetch(`${API_URL}/${BIBLE_ID}/chapters/${capituloId}?content-type=text`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el contenido del capítulo: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📜 Contenido del capítulo obtenido:", data.data?.content);

    return data.data?.content || "⚠️ No hay contenido disponible.";
  } catch (error) {
    console.error(`⚠️ Error al obtener el contenido del capítulo ${capituloId}:`, error);
    return "⚠️ Error al cargar el contenido.";
  }
}

// 📌 Buscar un libro por nombre
export async function buscarLibro(nombre: string): Promise<Libro[]> {
  const libros = await obtenerLibros();
  return libros.filter((libro) =>
    libro.name.toLowerCase().includes(nombre.toLowerCase())
  );
}
