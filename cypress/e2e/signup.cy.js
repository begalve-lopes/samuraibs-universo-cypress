import SignupPage from "../support/pages/signup";

describe("Cadastro de usuário", () => {
  before(function () {
    cy.fixture("signup").then((signup) => {
      this.success = signup.success;
      this.email_dup = signup.email_dup;
      this.email_inv = signup.email_inv;
      this.short_password = signup.short_password;
    });
  });

  context("Quando o usuário é novato", () => {
    before(function () {
      cy.task("deleteUser", this.success.email).then((resultado) => {
        console.log(resultado);
      });
    });

    it("Deve cadastrar com sucesso", function () {
      SignupPage.go();
      SignupPage.form(this.success);
      SignupPage.submit();

      SignupPage.toast.shouldHaveText(
        "Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!",
      );
    });
  });

  context("Quando o email já está cadastrado", () => {
    before(function () {
      cy.postUser(this.email_dup);
    });

    it("Não deve cadastrar com email já existente", function () {
      SignupPage.go();
      SignupPage.form(this.email_dup);
      SignupPage.submit();

      SignupPage.toast.shouldHaveText(
        "Email já cadastrado para outro usuário.",
      );
    });
  });

  context("Quando o email é inválido", function () {
    it("Deve exibir mensagem de alerta", function () {
      SignupPage.go();
      SignupPage.form(this.email_inv);
      SignupPage.submit();
      SignupPage.alert.haveText("Informe um email válido");
    });
  });

  context("Quando a senha tem menos de 6 caracteres", function () {
    const passwords = ["1", "12", "123", "1234", "begas"];

    passwords.forEach((p) => {
      it("Não deve cadastrar a senha : " + p, function () {
        this.short_password.password = p;
        SignupPage.go();

        SignupPage.form(this.short_password);
        SignupPage.submit();
      });
    });

    afterEach(() => {
      SignupPage.alert.haveText("Pelo menos 6 caracteres");
    });
  });

  context("Quando todos os campos estão vazios", () => {
    const alertMessages = [
      "Nome é obrigatório",
      "E-mail é obrigatório",
      "Senha é obrigatória",
    ];

    beforeEach(() => {
      SignupPage.go();
      SignupPage.submit();
    });

    alertMessages.forEach((alert) => {
      it(`Deve exibir mensagens de alerta para cada campo: ${alert.toLowerCase()}`, () => {
        SignupPage.alert.haveText(alert);
      });
    });
  });
});
