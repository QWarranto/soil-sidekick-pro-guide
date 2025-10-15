// List of known disposable/temporary email domains
const disposableEmailDomains = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'throwaway.email',
  'gamegta.com',
  'yopmail.com',
  'maildrop.cc',
  'temp-mail.org',
  'getnada.com',
  'trashmail.com',
  'getairmail.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'trbvm.com',
  'mailnesia.com',
  'mytemp.email',
  'tempinbox.com',
  'fakeinbox.com',
  'emailondeck.com',
  '10mail.org',
  'mohmal.com',
  'mintemail.com',
  'dispostable.com',
  'anonbox.net',
  'jetable.org',
  'throwam.com',
  'spamgourmet.com',
  'kasmail.com',
  'spamfree24.org',
  'anonymbox.com',
  'bugmenot.com',
  'mailcatch.com',
  'mailexpire.com',
  'rcpt.at',
  'trashmailer.com',
  'wegwerfmail.de',
  'zehnminuten.de',
];

export const isDisposableEmail = (email: string): boolean => {
  const emailLower = email.toLowerCase().trim();
  const domain = emailLower.split('@')[1];
  
  if (!domain) return false;
  
  return disposableEmailDomains.includes(domain);
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailLower = email.toLowerCase().trim();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailLower)) {
    return {
      valid: false,
      error: 'Please enter a valid email address'
    };
  }
  
  // Check for disposable email
  if (isDisposableEmail(emailLower)) {
    return {
      valid: false,
      error: 'Temporary or disposable email addresses are not allowed. Please use a permanent email address.'
    };
  }
  
  return { valid: true };
};
