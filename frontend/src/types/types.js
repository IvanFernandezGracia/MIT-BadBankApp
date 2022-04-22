export const types = {
  authLoggedIn:
    "[auth] Finish checking is Logged, auth user data successfully obtained",
  authCheckingIsLoggedFinish: "[auth] Finish checking is Logged",
  authNewDeposit: "[auth] New deposit Create",
  authNewWhitdraw: "[auth] New whitdraw Create",
  authLogout: "[auth] Logged out, delete token auth in localStorage",
  authRefreshTokenAccess: "[auth] Refresh Token Access",
  authNewPayment: "[auth] New Payment Create",

  isLoadingFetchStart: "[ui] Fetch waiting response",
  isLoadingFetchFinish: "[ui] Fetch finish whit response or error",

  usersLoad: "[allUsers] Loading all users register bank",
  usersUpdated: "[allUsers] Update User after deposit",
};
