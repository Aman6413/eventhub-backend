const wrap = (title, body) => `
  <div style="font-family: Arial,Helvetica,sans-serif;line-height:1.5;color:#333;">
    <div style="max-width:680px;margin:0 auto;padding:24px;border:1px solid #e6e6e6;border-radius:8px;">
      <h2 style="margin-top:0;color:#1e3a8a">${title}</h2>
      <div style="margin-top:8px;font-size:14px">${body}</div>
      <hr style="margin:20px 0;border:none;border-top:1px solid #eee" />
      <p style="font-size:12px;color:#666">This is an automated message from EventHub.</p>
    </div>
  </div>
`;

export const newEventTemplate = (event) => {
  const body = `
    <p>A new event has been created:</p>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Registration Deadline:</strong> ${event.registrationDeadline || '-'}</p>
    <p>${event.description || ''}</p>
  `;
  return wrap('New Event Created', body);
};

export const updatedEventTemplate = (event) => {
  const body = `
    <p>The event you registered for has been <strong>updated</strong>:</p>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Registration Deadline:</strong> ${event.registrationDeadline || '-'}</p>
    <p>${event.description || ''}</p>
  `;
  return wrap('Event Updated', body);
};

export const cancelledEventTemplate = (event) => {
  const body = `
    <p>The following event has been <strong>cancelled</strong>:</p>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p>${event.description || ''}</p>
  `;
  return wrap('Event Cancelled', body);
};

export const studentConfirmationTemplate = (event, student) => {
  const body = `
    <p>Hi ${student.name || 'Student'},</p>
    <p>Your registration for the event is confirmed:</p>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Registration Deadline:</strong> ${event.registrationDeadline || '-'}</p>
    <p>${event.description || ''}</p>
  `;
  return wrap('Registration Confirmed', body);
};

export const adminRegistrationNotificationTemplate = (event, student) => {
  const body = `
    <p>Student <strong>${student.name || student.email}</strong> has registered for an event:</p>
    <p><strong>Event:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Student Email:</strong> ${student.email}</p>
  `;
  return wrap('New Registration', body);
};



export const otpTemplate = (otp) => {
  const body = `
    <p>Use the following One-Time Password (OTP) to reset your EventHub password:</p>
    <h2 style="font-family:monospace;background:#f3f4f6;padding:12px;border-radius:6px;display:inline-block">${otp}</h2>
    <p style="margin-top:8px">This OTP is valid for 15 minutes.</p>
  `;
  return wrap('Password Reset OTP', body);
};

export const passwordResetSuccessTemplate = () => {
  const body = `
    <p>Your password has been successfully reset. If you did not perform this action, please contact support immediately.</p>
  `;
  return wrap('Password Reset Successful', body);
};

// update default export to include new helpers
export default {
  newEventTemplate,
  updatedEventTemplate,
  cancelledEventTemplate,
  studentConfirmationTemplate,
  adminRegistrationNotificationTemplate,
  otpTemplate,
  passwordResetSuccessTemplate,
};
