export const emptyContactForm = {
  nome: "",
  email: "",
  perfil: "",
  assunto: "",
  operacao: "",
  mensagem: "",
};

export function validateContact(values) {
  const errors = {};
  const parts = values.nome.trim().split(/\s+/).filter(Boolean);
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  if (!values.nome.trim()) errors.nome = "Informe seu nome completo.";
  else if (parts.length < 2) errors.nome = "Digite nome e sobrenome.";
  else if (
    !parts.every(
      (part) => namePattern.test(part) && part.replace(/['-]/g, "").length >= 2,
    )
  ) {
    errors.nome = "Nome e sobrenome precisam ter pelo menos 2 letras cada.";
  }

  if (!values.email.trim()) errors.email = "Informe seu e-mail.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Digite um e-mail válido, como nome@email.com.";
  }

  if (!values.mensagem.trim())
    errors.mensagem = "Escreva uma mensagem antes de enviar.";
  else if (values.mensagem.length > 500)
    errors.mensagem = "A mensagem deve ter no máximo 500 caracteres.";

  return errors;
}
