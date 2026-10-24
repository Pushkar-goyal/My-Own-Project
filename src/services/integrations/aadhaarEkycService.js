/**
 * Aadhaar eKYC Integration Service Stub (OTP & Biometric)
 */
export const aadhaarEkycService = {
  async sendOTP(aadhaarNumber) {
    console.log(`[Aadhaar eKYC] Sending OTP to registered mobile for Aadhaar: ${aadhaarNumber}`);
    return { success: true, txnId: 'TXN_' + Date.now(), message: 'OTP sent to mobile ending in ******4321' };
  },

  async verifyOTP(txnId, otp) {
    console.log(`[Aadhaar eKYC] Verifying OTP ${otp} for Txn ${txnId}`);
    return {
      success: true,
      kycData: {
        name: 'Pushkar Goel',
        dob: '1995-04-12',
        gender: 'M',
        address: '123, Central Avenue, Connaught Place, New Delhi',
        photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      }
    };
  }
};
