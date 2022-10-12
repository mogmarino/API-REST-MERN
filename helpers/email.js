import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;

  // TODO: pasar a variables de entorno
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

export const emailOlvidePass = async (datos) => {
  const { nombre, email, token } = datos;

  // TODO: pasar a varaibles de entorno
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
    subject: "UpTask Reestablece tu password",
    text: "Reestablece tu password",
    html: `<p>Hola: ${nombre} Has solicitado reestablecer tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password</p>
    <a href="${process.env.FRONTEND_URL}/olvide-pass/${token}">Reestablecer password</a>
    <p>Si tu no solicitaste reestablecer el password, puedes ignorar este mensaje</p>
    `,
  });
};
