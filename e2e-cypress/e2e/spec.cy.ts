describe('Starwars dashboards', () => {

  const screens = [
    { url: '/', selector: 'characters', attributes: ['character', 'Planet'], selectItem: 'starship' },
    { url: '/starships', selector: 'starships', attributes: ['starship', 'Model'], selectItem: 'pilot' },
    { url: '/planets', selector: 'planets', attributes: ['planet', 'Population'], selectItem: 'resident' }
  ];

  screens.forEach((screen) => {

    describe(`${screen.attributes[0].charAt(0).toUpperCase()}${screen.attributes[0].slice(1)}s`, function() {
      beforeEach(function() {
        cy.fixture(screen.selector).then((data) => {
          this['data'] = data;
        });
        cy.visit(screen.url);
      });

      context(`Display list of ${screen.selector} and details of a selected ${screen.attributes[0]}`, function() {
        it(`should navigate to the ${screen.selector} dashboard and display a list ${screen.selector}`, function() {
          cy.get('h2').should('contain', this["data"].pageTitle);
          cy.get("[data-cy='listView']").should('be.visible')
            .should('contain', this['data'].listHeading)
            .should('contain', this['data'].list[0].name)
            .should('contain', this['data'].list[2].name);
        });

        it(`should select and display details of a ${screen.attributes[0]}`, function() {
          cy.contains(this['data'].list[0].name).click();
          cy.get("[data-cy='detailsView']").should('be.visible')
            .should('contain', this['data'].detailsHeading)
            .should('contain', `Name: ${this['data'].list[0].name}`)
            .should('contain', `${screen.attributes[1]}: ${this['data'].list[0].keyA}`)
            .should('contain', this['data'].list[0].keyB[0])
            .should('contain', this['data'].list[0].keyB[1]);
        });

        it(`should display a list of ${screen.selector} when 'View all ${screen.selector}' link is followed`, function() {
          cy.contains(this['data'].list[0].name).click();
          cy.contains(`View all ${screen.selector}`).click();
          cy.get("[data-cy='listView']").should('be.visible')
            .should('contain', this['data'].listHeading)
            .should('contain', this['data'].list[0].name)
            .should('contain', this['data'].list[2].name);
        });

        it(`should select and display details of a ${screen.attributes[0]}'s ${screen.selectItem}`, function() {
          cy.contains(this['data'].list[0].name).click();
          cy.get("[data-cy='detailsView']").should('be.visible');
          cy.contains(this['data'].list[0].keyB[0]).click();
          cy.get(`[data-cy="${this['data'].selectedProperty.screen}"]`).get("[data-cy='detailsView']").contains(this['data'].selectedProperty.name).should('be.visible');
        });
      });

      context(`Search ${screen.selector} by name`, function() {
        it(`should display 'No results for your search', when there are no search results`, () => {
          cy.get(`[data-cy="${screen.selector}"]`).find('input').type("abc")
            .get('mat-option').contains('No results for your search').should('be.visible');
        });

        it(`should execute a search of ${screen.selector} and display details of a selected ${screen.attributes[0]}`, function() {
          cy.get(`[data-cy="${screen.selector}"]`).find('input').type("l")
            .get('mat-option').contains(this['data'].list[0].name).should('be.visible')
            .get('mat-option').contains(this['data'].list[1].name).click();
          cy.get("[data-cy='detailsView']").should('be.visible')
            .should('contain', `Name: ${this['data'].list[1].name}`)
            .should('contain', this['data'].detailsHeading)
            .should('contain', `${screen.attributes[1]}: ${this['data'].list[1].keyA}`)
            .should('contain', this['data'].list[0].keyB[0])
            .should('contain', this['data'].list[0].keyB[1]);
        });
      });
    });
  });
});
