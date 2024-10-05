describe('Game Component', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.intercept('GET', '**/people/*').as('getPerson');
    cy.intercept('GET', '**/starships/*').as('getStarship');
  });

  it('should display player cards after clicking Play', () => {
    cy.get('button').contains('Play').should('be.visible');
    cy.get('button').contains('Play').click();

    cy.window().then((win) => {
      const isPersonGame = win.ng.getComponent(win.document.querySelector('app-game')).isPersonGame;

      if (isPersonGame) {
        cy.wait('@getPerson').then(() => {
          cy.get('.card').should('have.length', 2);
          cy.get('.card').first().should('contain', 'Person (Left)');
          cy.get('.card').last().should('contain', 'Person (Right)');
        });
      } else {
        cy.wait('@getStarship').then(() => {
          cy.get('.card').should('have.length', 2);
          cy.get('.card').first().should('contain', 'Starship (Left)');
          cy.get('.card').last().should('contain', 'Starship (Right)');
        });
      }
    });
  });

  it('should display the winner message after playing', () => {
    cy.get('button').contains('Play').click();

    cy.window().then((win) => {
      const isPersonGame = win.ng.getComponent(win.document.querySelector('app-game')).isPersonGame;

      if (isPersonGame) {
        cy.wait('@getPerson').then(() => {
          cy.get('.game__result-text').should('be.visible');
        });
      } else {
        cy.wait('@getStarship').then(() => {
          cy.get('.game__result-text').should('be.visible');
        });
      }
    });
  });

  it('should handle draw or increment the win counter if there is a winner', () => {
    cy.get('.game__scoreboard-item').then($scoreboard => {
      const leftWinsBefore = parseInt($scoreboard.eq(0).text().split(': ')[1]);
      const rightWinsBefore = parseInt($scoreboard.eq(1).text().split(': ')[1]);
  
      cy.get('button').contains('Play').click();
      cy.get('.game').invoke('attr', 'data-is-person-game').then((isPersonGame) => {
        const waitAlias = isPersonGame === 'true' ? '@getPerson' : '@getStarship';
  
        cy.wait(waitAlias).then(() => {
          cy.get('.game__result-text').then($result => {
            const resultText = $result.text();
            cy.get('.game__scoreboard-item').then($newScoreboard => {
              const leftWinsAfter = parseInt($newScoreboard.eq(0).text().split(': ')[1]);
              const rightWinsAfter = parseInt($newScoreboard.eq(1).text().split(': ')[1]);
  
              if (resultText.includes('Draw')) {
                expect(leftWinsAfter).to.equal(leftWinsBefore);
                expect(rightWinsAfter).to.equal(rightWinsBefore);
              } else {
                if (resultText.includes('Left wins')) {
                  expect(leftWinsAfter).to.be.greaterThan(leftWinsBefore);
                } else if (resultText.includes('Right wins')) {
                  expect(rightWinsAfter).to.be.greaterThan(rightWinsBefore);
                }
              }
            });
          });
        });
      });
    });
  });
});
 
