import { supabaseAxiosInstance } from "./axiosInstance";

const sendEmail = ({ to, subject, html }) => {
  if(!to || !subject || !html) throw new Error("to, subject, and html are required parameters");
  
  supabaseAxiosInstance.post("/functions/v1/send-email", { to, subject, html })
    .then(response => {
      console.log("sendEmail: Success", response?.data?.message);
    })
    .catch(error => {
      console.error("sendEmail: Error sending email", String(error));
  });
};

export { sendEmail };