import { supabaseAxiosInstance } from "./axiosInstance";

const sendEmail = ({ to, subject, html }) => {
  if(!to || !subject || !html) throw new Error("to, subject, and html are required parameters");
  
  supabaseAxiosInstance.post("/functions/v1/send-email", { to, subject, html }).then(response => {
    if (response.status !== 200) throw new Error(`Failed to send email: ${response.error}`);
    return response.data;
  }).catch(error => {
    throw error;
  });
};

export { sendEmail };