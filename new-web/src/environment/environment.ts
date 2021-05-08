export const environment: {
  production: boolean;
  apiPrefix: string | undefined;
} = {
  production: process.env.REACT_APP_ENVIRONMENT === 'production',
  apiPrefix: process.env.REACT_APP_API_PREFIX,
};
