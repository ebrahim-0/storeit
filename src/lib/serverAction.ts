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
      // return { success: true, value };
      return value;
    } catch (error) {
      if (error instanceof ServerActionError)
        return { error: { message: error.message } };

      // return { success: false, error: error.message };
      // return error;
      throw error;
    }
  };
}
