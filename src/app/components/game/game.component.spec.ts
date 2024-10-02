describe('Game Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display player cards after clicking Play', () => {
    cy.get('button').contains('Play').should('be.visible');

    cy.get('button').contains('Play').click();

    cy.get('.player-card').should('have.length', 2);
    cy.get('.player-card').first().should('contain', 'Left Player');
    cy.get('.player-card').last().should('contain', 'Right Player');
  });

  it('should display the winner message after playing', () => {
    cy.get('button').contains('Play').click();
    
    cy.get('.result-display').should('be.visible');
  });

  it('should increment the win counters', () => {
    cy.get('button').contains('Play').click();
    
    cy.get('.scoreboard mat-card-subtitle').then($subtitles => {
      const leftWinsBefore = parseInt($subtitles[0].innerText.split(': ')[1]);
      const rightWinsBefore = parseInt($subtitles[1].innerText.split(': ')[1]);

      cy.get('button').contains('Play').click();
      
      cy.get('.scoreboard mat-card-subtitle').then($newSubtitles => {
        const leftWinsAfter = parseInt($newSubtitles[0].innerText.split(': ')[1]);
        const rightWinsAfter = parseInt($newSubtitles[1].innerText.split(': ')[1]);

        expect(leftWinsAfter).to.be.greaterThan(leftWinsBefore);
        expect(rightWinsAfter).to.be.greaterThan(rightWinsBefore);
      });
    });
  });

  it('should show a loading spinner while fetching data', () => {
    cy.get('button').contains('Play').click();
    
    cy.get('.loading-spinner').should('be.visible');

    cy.get('.loading-spinner').should('not.exist');
  });
});
