export const redirects = {
  '/old-page/': '/new-page/',
  '/temp-redirect/': {
    status: 302 as const,
    destination: '/somewhere/',
  },
};
