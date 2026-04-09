import SignupPage from "../support/pages/signup";

describe("Cadastro de usuário", () => {
  
  context("Quando o usuário é novato", () => {
    const user = {
      name: "Begave da Silva",
      email: "begave@email.com",
      password: "123456",
    };

    before(() => {
      cy.task("deleteUser", user.email).then((resultado) => {
        console.log(resultado);
      });
    });

    it("Deve cadastrar com sucesso", () => {
      SignupPage.go();
      SignupPage.form(user);
      SignupPage.submit();

      SignupPage.toast.shouldHaveText(
        "Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!",
      );
    });
  });

  context("Quando o email já está cadastrado", () => {
    const user = {
      name: "Begas Silva",
      email: "begas@email.com",
      password: "123456",
      is_provider: true,
    };

    before(() => {
      cy.task("deleteUser", user.email).then((resultado) => {
        console.log(resultado);
      });

      cy.request({
        method: "POST",
        url: "http://localhost:3333/users",
        body: user,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("name", user.name);
        expect(response.body).to.have.property("email", user.email);
      });
    });

    it("Não deve cadastrar com email já existente", () => {
      SignupPage.go();
      SignupPage.form(user);
      SignupPage.submit();

      SignupPage.toast.shouldHaveText(
        "Email já cadastrado para outro usuário.",
      );
    });
  });

  context("Quando o email é inválido", () => {
    const user = {
      name: "Begas Silva",
      email: "begasemail.com",
      password: "123456",
    };

    it("Deve exibir mensagem de alerta", () => {
      SignupPage.go();
      SignupPage.form(user);
      SignupPage.submit();
      SignupPage.alertHaveText("Informe um email válido");
    });
  });

  context("Quando a senha tem menos de 6 caracteres", () => {
    const passwords = ["1", "12", "123", "1234", "begas"];

    beforeEach(() => {
      SignupPage.go();
    });

    passwords.forEach((p) => {
      const user = {
        name: "Begas Silva",
        email: "begas@email.com",
        password: p,
      };

      it("Não deve cadastrar a senha : " + p, () => {
        SignupPage.form(user);
        SignupPage.submit();
      });
    });

    afterEach(() => {
      SignupPage.alertHaveText("Pelo menos 6 caracteres");
    });
  });

  context("Quando todos os campos estão vazios", () => {
    const alertMessages = [
      "Nome é obrigatório",
      "E-mail é obrigatório",
      "Senha é obrigatória",
    ];

    before(() => {
      SignupPage.go();
      SignupPage.submit();
    });

    alertMessages.forEach((alert) => {
      it("Deve exibir mensagens de alerta para cada campo",  + alert.toLowerCase(),() => {
        SignupPage.alertHaveText(alert);
      });
    });
  });
});
