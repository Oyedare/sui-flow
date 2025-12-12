export interface ProtocolInfo {
  name: string;
  url: string;
  color: string;
  type: 'LP' | 'STAKED' | 'LENDING';
}

export function identifyProtocol(coinType: string): ProtocolInfo | null {
  const type = coinType.toLowerCase();

  // Cetus
  if (type.includes("::cetus::") || type.includes("::lps::")) { 
    return {
      name: "Cetus Protocol",
      url: "https://app.cetus.zone/", // Direct to main app to trigger 'My Positions' view
      color: "text-orange-500",
      type: 'LP'
    };
  }

  // Turbos
  if (type.includes("::turbos::") || type.includes("::pool::")) {
    return {
      name: "Turbos Finance",
      url: "https://app.turbos.finance/earn",
      color: "text-blue-500",
      type: 'LP'
    };
  }

  // Kriya
  if (type.includes("::kriya::") || type.includes("::spot::")) {
    return {
      name: "Kriya DEX",
      url: "https://app.kriya.finance/portfolio",
      color: "text-purple-500",
      type: 'LP'
    };
  }

  // Aftermath
  if (type.includes("::aftermath::") || type.includes("::af_lp::")) {
    return {
      name: "Aftermath Finance",
      url: "https://aftermath.finance/stake",
      color: "text-yellow-500",
      type: 'LP'
    };
  }

  // Navi (Lending)
  if (type.includes("::navi::") || type.includes("::n_coin::")) {
      return {
        name: "Navi Protocol",
        url: "https://app.naviprotocol.io/",
        color: "text-teal-500",
        type: 'LENDING'
      };
  }

  // Scallop (Lending)
  if (type.includes("::scallop::") || type.includes("sbit::") || type.includes("sui::coin")) {
      if(type.includes("::market::")) {
         return {
            name: "Scallop",
            url: "https://app.scallop.io/dashboard",
            color: "text-sky-500",
            type: 'LENDING'
         };
      }
  }

  return null;
}
