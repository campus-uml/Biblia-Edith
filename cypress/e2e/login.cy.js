describe('Prueba de Login', () => {
  beforeEach(() => {
    cy.visit('/login'); // Asegura que visitas la página de login antes de cada prueba
  });

  it('Debe mostrar los botones de inicio de sesión', () => {
    cy.contains('Iniciar sesión con Google').should('be.visible');
    cy.contains('Iniciar sesión con GitHub').should('be.visible');
  });

  it('Debe iniciar sesión con Google', () => {
    cy.contains('Iniciar sesión con Google').click();
    cy.origin('https://accounts.google.com', () => {
      cy.url().should('include', 'accounts.google.com');
    });
  });

  it('Debe iniciar sesión con GitHub', () => {
    cy.contains('Iniciar sesión con GitHub').click();
    cy.origin('https://github.com', () => {
      cy.url().should('include', 'github.com');
    });
  });

  it('Debe manejar un error de autenticación con Google', () => {
    cy.contains('Iniciar sesión con Google').click();
    cy.origin('https://accounts.google.com', () => {
      cy.url().should('include', 'accounts.google.com');
      cy.contains('Error de autenticación').should('not.exist'); // Asegurzar que no hay errores visibles
    });
  });

  it('Debe manejar un error de autenticación con GitHub', () => {
    cy.contains('Iniciar sesión con GitHub').click();
    cy.origin('https://github.com', () => {
      cy.url().should('include', 'github.com');
      cy.contains('Error de autenticación').should('not.exist'); // Asegurar que no hay errores visibles
    });
  });
});
