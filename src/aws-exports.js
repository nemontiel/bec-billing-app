const awsExports = {
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      // OPTIONAL - Set to true to use your identity pool's unauthenticated role when user is not logged in
      allowGuestAccess: false,
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      //signUpVerificationMethod: "code", // 'code' | 'link'
    },
  },
};

export default awsExports;
