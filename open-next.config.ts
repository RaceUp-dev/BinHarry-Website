const config = {
  default: {
    override: 'cloudflare-workers',
  },
  middleware: {
    external: false,
  },
  imageOptimization: {
    external: true,
  },
};

export default config;
