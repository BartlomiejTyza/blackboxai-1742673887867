const nodemailer = require('nodemailer');

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailTemplates = {
  promotion: (clientName, promotionDetails) => ({
    subject: 'Specjalna promocja w WaxingTime!',
    html: `
      <h2>Cześć ${clientName}!</h2>
      <p>Mamy dla Ciebie specjalną ofertę:</p>
      <div style="padding: 20px; background-color: #f8f9fa; margin: 20px 0;">
        ${promotionDetails}
      </div>
      <p>Zapraszamy do rezerwacji!</p>
      <p>Pozdrawiamy,<br>Zespół WaxingTime</p>
    `
  }),
  
  appointmentReminder: (clientName, appointmentDate, service) => ({
    subject: 'Przypomnienie o wizycie w WaxingTime',
    html: `
      <h2>Cześć ${clientName}!</h2>
      <p>Przypominamy o Twojej nadchodzącej wizycie:</p>
      <div style="padding: 20px; background-color: #f8f9fa; margin: 20px 0;">
        <p><strong>Data:</strong> ${appointmentDate}</p>
        <p><strong>Usługa:</strong> ${service}</p>
      </div>
      <p>Do zobaczenia!</p>
      <p>Pozdrawiamy,<br>Zespół WaxingTime</p>
    `
  }),

  loyaltyUpdate: (clientName, points, isEligibleForDiscount) => ({
    subject: 'Aktualizacja punktów lojalnościowych',
    html: `
      <h2>Cześć ${clientName}!</h2>
      <p>Dziękujemy za korzystanie z naszych usług!</p>
      <div style="padding: 20px; background-color: #f8f9fa; margin: 20px 0;">
        <p>Twój aktualny stan punktów: <strong>${points}</strong></p>
        ${isEligibleForDiscount ? 
          '<p style="color: #28a745;">Gratulacje! Możesz wykorzystać swoje punkty na 10% zniżki przy następnej wizycie!</p>' : 
          `<p>Jeszcze ${Math.ceil(10 - points)} punktów do zdobycia 10% zniżki!</p>`}
      </div>
      <p>Pozdrawiamy,<br>Zespół WaxingTime</p>
    `
  })
};

const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](...data);
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};