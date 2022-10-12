import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

export const emailOlvidePass = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //informacion del email
  const info = await transport.sendMail({
    from: '"UpTask Admin Proyecto" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask Reestablece tu password",
    text: "Reestablece tu password",
    html: `<p>Hola: ${nombre} Has solicitado reestablecer tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password</p>
    <a href="${process.env.FRONTEND_URL}/olvide-pass/${token}">Reestablecer password</a>
    <p>Si tu no solicitaste reestablecer el password, puedes ignorar este mensaje</p>
    `,
  });
};
