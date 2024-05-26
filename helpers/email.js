import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"CIE - Administrador de Proyectos" <cuentas@cie.com>',
    to: email,
    subject: "CIE - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en CIE",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en CIE</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    
    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"CIE - Administrador de Movimientos" <cuentas@cie.com>',
    to: email,
    subject: "CIE - Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>

    <p>Sigue el siguiente enlace para generar un nuevo password: 

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
    
    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    
    
    `,
  });
};

export const emailSolicitudDeAutorizacion = async (datos) => {
  try {
    const { email, nombre, justificacion } = datos;

    console.log(email);

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Información del email

    // Verifica si el correo electrónico es un arreglo
    if (Array.isArray(email)) {
      // Recorre los correos electrónicos y envía un correo a cada uno
      for (const direccionEmail of email) {
        const info = await transport.sendMail({
          from: '"CPRONET-CIE - Administrador de Autorizaciones" <cuentas@cie.com>',
          to: direccionEmail,
          subject: "CPRONET-CIE - Autorizacion Pendiente",
          text: "Tienes una autorizacion pendiente",
          html: `<p>Hola: ${nombre} ha solicitado autorizacion para modificar un movimiento cuya fecha de edicion ya fue cerrada</p>
          
          <p>Esta es su justificación: "${justificacion}" </p>
    
          <p>Sigue el siguiente enlace para autorizar o rechazar la solicitud: 
          <a href="${process.env.FRONTEND_URL}/autorizaciones">Autorizar o Rechazar</a>
          </p>
    
          <p>También puedes ver en tu panel de notificaciones tus pendientes.</p>
          `,
        });

        console.log(`Correo enviado a ${direccionEmail}: ${info.messageId}`);
      }
    } else {
      throw new Error('La dirección de correo electrónico no es un arreglo');
    }
  } catch (error) {
    console.error('Error al enviar correos electrónicos:', error);
    throw new Error('Ocurrió un error al enviar correos electrónicos');
  }
};


