// notificationService.js

const axios = require('axios');
import { Resend } from 'resend';

async function sendSMS(client, message) {
    const cleanPhoneNumbers = (phoneNumbers) => {
            return phoneNumbers.map(number => {
              // Convert to string in case some numbers are stored as integers
              let cleaned = number.toString();
              // If the number starts with '254254', remove the extra '254'
              if (cleaned.startsWith("254254")) {
                cleaned = cleaned.slice(3); // Remove the first three characters
              }
              // If the number starts with '0', replace it with '254'
              if (cleaned.startsWith("0")) {
                cleaned = "254" + cleaned.slice(1); // Replace leading '0' with '254'
              }
              // Return the cleaned number
              return cleaned;
            });
          };
          
    const cleanedNumbers = cleanPhoneNumbers(client);
    try {
         const {data} = await axios.post("https://smsportal.hostpinnacle.co.ke/SMSApi/send",
                  {
                        userid : "andrewwachira1",
                        password : "Exclamation1!",
                        senderid : "RIVERSIDE",
                        msgType : "unicode",
                        duplicatecheck : "true",
                        sendMethod : "quick",
                        sms: [
                            {
                            mobile: cleanedNumbers,
                            msg: message
                            }
                        ]
                    },
                )
        return({status:200,message:"Text sent successfully"});
    } catch (error) {
        console.error('SMS sending error:', error);
        throw new Error({status:500,message:error.message});
    }
}

/**
 * Send email notification to client
 * Replace this implementation with your preferred email provider
 * @param {string} email - The client's email address
 * @param {string} subject - The email subject
 * @param {string} message - The email body
 * @returns {Promise} - Promise resolving to the email provider's response
 */
async function sendEmail(email, subject, body) {
 const resend = new Resend(process.env.RESEND);
    try{
      const {data,error} = await resend.emails.send({
        from: 'contact@riversidefilters.co.ke',
        to: email,
        subject,
        html: body
      });
   
      if (error) {
        console.error("Error sending email:", error);
        throw new Error({ error: "Failed to send email" }, { status: 500 });
      }
      return({ message: "Email sent successfully" }, { status: 200 });
    }catch (error) {
        console.error("Error sending email:", error);
        return({ error: "Failed to send email" }, { status: 500 });
    }
}

module.exports = { sendSMS, sendEmail };