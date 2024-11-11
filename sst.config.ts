/// <reference path="./.sst/platform/config.d.ts" />
const accountId = process.env.ACCOUNT_ID!;
const apiToken = process.env.API_TOKEN!;
export default $config({
  app(input) {
    return {
      name: "sst-cf",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "local",
      providers: { cloudflare: "5.42.0"},
    };
  },
  async run() {
    const tunnel = new cloudflare.ZeroTrustTunnelCloudflared('test-tunnel', {
      accountId,
      name: 'test-tunnel',
      secret: btoa(crypto.randomUUID()),
    })
    
    // new cloudflare.ZeroTrustTunnelCloudflaredConfig('test-tunnel-config', {
    //   accountId,
    //   tunnelId: tunnel.id,
    //   config: {
    //     ingressRules: [
    //       {
    //         hostname: name,
    //         service: 'http://ionite-cicd:3000'
    //       },
    //       {
    //         service: 'http://ionite-cicd:3000'
    //       },
    //     ]
    //   }
    // })
 
    const zone = cloudflare.getZone({
      accountId,
      name: 'enterpriseeffective.org'
    })
 
    new cloudflare.Record('test-tunnel', {
      name: 'test',
      type: "CNAME",
      zoneId: (await zone).zoneId,
      content: tunnel.cname,
      proxied: true,
    })
  },
});
 
 
