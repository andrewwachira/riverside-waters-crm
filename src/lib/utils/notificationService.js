// notificationService.js
const axios = require('axios');

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
        return res.json({status:200,message:"Text sent successfully"});
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
async function sendEmail(email, subject, message) {
    try {
        // This is a placeholder implementation
        // Replace with your actual email provider's API
        
        // Example with a generic API service
        // const response = await axios.post('https://your-email-provider.com/api/send', {
        //     apiKey: process.env.EMAIL_API_KEY,
        //     to: email,
        //     subject: subject,
        //     body: message
        // });
        
        // Log for development/testing purposes
        console.log(`[EMAIL SIMULATION] To: ${email}, Subject: ${subject}, Message: ${message}`);
        
        // Return success for now (replace with actual implementation)
        return { success: true, id: 'email-' + Date.now() };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

module.exports = { sendSMS, sendEmail };