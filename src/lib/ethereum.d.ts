// Ethereum window type declaration
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      providers?: any[];
      isMetaMask?: boolean;
      isRabby?: boolean;
    };
    _activeProvider?: any;
  }
}

export {};
