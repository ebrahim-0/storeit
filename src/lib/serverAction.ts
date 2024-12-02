export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerActionError";
  }
}

export function createServerAction(callback: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      const value: any = (await callback(...args)) as any;
      return value;
    } catch (error) {
      if (error instanceof ServerActionError)
        return { error: { message: error.message } };

      throw error;
    }
  };
}
