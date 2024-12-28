export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerActionError";
  }
}

export function createServerAction(callback: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      const value: any = await callback(...args);
      return value;
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };
}
