describe('Pruebas de la App de la Biblia', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', 'https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/books', {
      fixture: 'libros.json'
    }).as('getLibros');

    cy.intercept('GET', 'https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/books/*/chapters', {
      fixture: 'capitulos.json'
    }).as('getCapitulos');

    cy.intercept('GET', 'https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/chapters/*?content-type=text', {
      fixture: 'contenido.json'
    }).as('getContenido');

    // Simulate login
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'fake-token');
    });
  });

  it('Debe mostrar el estado de carga inicial', () => {
    cy.get('[data-testid="loading-session"]').should('be.visible');
  });

  it('Debe mostrar la lista de libros después de cargar', () => {
    cy.wait('@getLibros');
    cy.contains('Libros').should('be.visible');
    cy.contains('Génesis').should('be.visible');
  });

  it('Debe mostrar el estado de carga al seleccionar un libro', () => {
    cy.wait('@getLibros');
    cy.contains('Génesis').click();
    cy.get('[data-testid="loading-content"]').should('be.visible');
  });

  it('Debe mostrar los capítulos de un libro seleccionado', () => {
    cy.wait('@getLibros');
    cy.contains('Génesis').click();
    cy.wait('@getCapitulos');
    cy.contains('Capítulos de Génesis').should('be.visible');
    cy.contains('1').should('be.visible');
  });

  it('Debe mostrar el contenido de un capítulo seleccionado', () => {
    cy.wait('@getLibros');
    cy.contains('Génesis').click();
    cy.wait('@getCapitulos');
    cy.contains('1').click();
    cy.wait('@getContenido');
    cy.contains('Génesis - Capítulo 1').should('be.visible');
    cy.contains('En el principio').should('be.visible');
  });

  it('Debe mostrar un mensaje de error al fallar la carga de libros', () => {
    cy.intercept('GET', 'https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/books', {
      statusCode: 500,
      body: 'Error del servidor'
    }).as('getLibrosError');
    
    cy.wait('@getLibrosError');
    cy.contains('Error al cargar los libros').should('be.visible');
  });

  it('Debe permitir navegar de vuelta a la lista de libros', () => {
    cy.wait('@getLibros');
    cy.contains('Génesis').click();
    cy.wait('@getCapitulos');
    cy.contains('Volver a libros').click();
    cy.contains('Libros').should('be.visible');
  });

  it('Debe ser accesible', () => {
  });

  it('Debe ser accesible', () => {
    cy.wait('@getLibros');
    cy.injectAxe();
    cy.checkA11y();

  });

  it('Debe ser responsive', () => {
    cy.viewport('iphone-6');
    cy.wait('@getLibros');
    cy.contains('Libros').should('be.visible');
  });

  it('Debe permitir cerrar sesión', () => {
    cy.get('[data-testid="logout-button"]').click();

    cy.contains('Iniciar sesión').should('be.visible');
  });
});
