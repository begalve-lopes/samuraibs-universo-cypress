import loginPage from "../support/pages/login/index";
import dashPage from "../support/pages/dash/index";

describe("Login", () => {
  context("Quando o usuário é novato", () => {
    const user = {
      name: "Begas Silva",
      email: "begas@email.com",
      password: "123456",
      is_provider: true,
    };

    before(() => {
      cy.postUser(user);
    });

    it("Deve logar com sucesso", () => {
      loginPage.go();
      loginPage.form(user);
      loginPage.submit();

      dashPage.header.userLoggedIn(user.name);
    });
  });

  context("Quando o usuário é bom mas a senha é incorreta", () => {
    let user = {
      name: "Begas Silva",
      email: "begas@email.com",
      password: "123456",
      is_provider: true,
    };

    before(() => {
      cy.postUser(user).then(() => {
        user.password = "654321";
      });
    });

    it("deve notificar erro de credenciais", () => {
      loginPage.go();
      loginPage.form(user);
      loginPage.submit();
      loginPage.toast.shouldHaveText(
        "Ocorreu um erro ao fazer login, verifique suas credenciais.",
      );
    });
  });

  context("Quando o formato do email é inválido", () => {
    const emails = [
      "begas.com",
      "@begas.com",
      "begas@.com",
      "begas@com.",
      "begas.com.br",
      "123456",
      "@",
      "@gmail.com",
      "papito@",
      "&*%$#@",
      "ccc11222",
    ];

    beforeEach(() => {
      loginPage.go();
    });

    emails.forEach((email) => {
      it(`não deve logar com o email: ${email}`, () => {
        const user = {
          email: email,
          password: "123456",
        };

        loginPage.form(user);
        loginPage.submit();
        loginPage.alert.haveText("Informe um email válido");
      });
    });
  });

  context.only("Quando não preenche os campos", () => {
    const alerts = ["E-mail é obrigatório", "Senha é obrigatória"];
    
    beforeEach(() => {
      loginPage.go();
      loginPage.submit();
    });

    alerts.forEach((alert) => {
      it(`deve exibir a mensagem de erro: ${alert.toLowerCase()}`, () => {
        loginPage.alert.haveText(alert);
      });
    });
  });
});
