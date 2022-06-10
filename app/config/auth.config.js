module.exports = {
  secret: "bezkoder-secret-key",
  jwtExpiration: 60 * 60 * 24, // 1 day
  jwtRefreshExpiration: 60 * 60 * 24 * 3, // 2 day

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
