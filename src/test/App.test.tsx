import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App'; // Ajusta la ruta de importación si es necesario
import { vi } from 'vitest'; // Importar vi desde Vitest


// Mock de Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: '123', email: 'test@example.com' } } },
      }),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ subscription: { unsubscribe: vi.fn() } }),
    },
  },
}));

// Mock del fetch con una respuesta más adecuada
vi.spyOn(global, 'fetch').mockResolvedValue(
  new Response(JSON.stringify([{ id: '1', name: 'Genesis' }]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
);

describe('App Component', () => {
  it('should display a loading session message initially', async () => {
    render(<App />);
    expect(screen.getByText('Cargando sesión...')).toBeInTheDocument();
  });

  it('should render books when the session is available', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Genesis'));
    expect(screen.getByText('Genesis')).toBeInTheDocument();
  });

  it('should display chapters after selecting a book', async () => {
    // Mock de capítulos
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: '1', numero: '1' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<App />);
    fireEvent.click(screen.getByText('Genesis'));
    await waitFor(() => screen.getByText('Capítulo 1'));
    expect(screen.getByText('Capítulo 1')).toBeInTheDocument();

});
});