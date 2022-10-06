import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "87cdb3d6884963",
      pass: "97fe6c05cd5a07",
    },
  });

  //informacion del email
  const info = await transport.sendMail({
    from: '"UpTask Admin Proyecto" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace</p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });
};
