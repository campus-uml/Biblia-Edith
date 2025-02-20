describe('App', () => {
  it('should load the session and display books', () => {
    cy.visit('/'); // Asegúrate de que tu aplicación está corriendo en el puerto 3000 (o el que configures en el baseUrl)
    
    // Verifica que el mensaje de sesión cargando se muestra
    cy.contains('Cargando sesión...');

    // Simula el inicio de sesión y la carga de libros
    cy.intercept('GET', '/api/libros', { fixture: 'libros.json' }).as('getLibros'); // Asegúrate de tener un archivo fixture/libros.json con los libros

    // Espera que los libros se carguen
    cy.wait('@getLibros');
    cy.contains('Genesis'); // Verifica que el libro 'Genesis' se muestre
  });

  it('should display chapters when a book is selected', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/capitulos', { fixture: 'capitulos.json' }).as('getCapitulos'); // Fixture de capítulos

    // Selecciona un libro
    cy.contains('Genesis').click();
    
    // Espera a que los capítulos se carguen y muestra el primer capítulo
    cy.wait('@getCapitulos');
    cy.contains('Capítulo 1'); // Verifica que el capítulo 1 está disponible
  });
});
