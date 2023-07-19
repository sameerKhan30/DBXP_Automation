const url = Cypress.config("baseUrl");

declare namespace Cypress {
    interface Chainable < Subject = any > {
    [x: string]: any;
        login(username : string, password : string, specName : string): typeof login;
        logout(): typeof logout;
        generateRandomNumber(): Cypress.Chainable<string>;

    }
}

function login(username : string, password : string, specName : string): void {
    cy.visit("/login");

    localStorage.setItem("locale", "en");

    // type within user field
    cy.get(".textBox > .form-control.userNameTbox").type(username).should("have.value", username);

    // type within password field
    cy.get(":nth-child(2) > .form-control").type(password).should("have.value", password);

    // click login button
    cy.get("button.btn.loginBtn").click();

    cy.visit("/home");

    cy.wait(2000);
}

function logout(): void {
    cy.get("app-headers").find(".user-container #dropdownMenuLink").click();

    cy.get("ul.dropdown-menu.show li:nth-child(2) a").click();
    cy.wait(2000);
    cy.get("button.btn.logout-button").click();

    // cy.visit('/login');

    cy.get("div.login-wrapper div.welcomeTxt").contains("Welcome to MyBank");
}

// Generate a random mobile number


Cypress.Commands.add('getIframe', () => {
    return cy.get('#unified-runner iframe').first().focus().its('0.contentDocument.body').should('not.be.empty').then(cy.wrap)
})

// NOTE: You can use it like so:
Cypress.Commands.add("login", login);
Cypress.Commands.add("logout", logout);
// Cypress.Commands.add("fn", generateRandomNumber);
