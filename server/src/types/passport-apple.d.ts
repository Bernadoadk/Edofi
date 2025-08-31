declare module 'passport-apple' {
  import { Strategy } from 'passport';
  
  interface AppleStrategyOptions {
    clientID: string;
    teamID: string;
    keyID: string;
    privateKeyLocation: string;
    callbackURL: string;
    passReqToCallback?: boolean;
  }
  
  interface AppleProfile {
    id: string;
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  }
  
  class AppleStrategy extends Strategy {
    constructor(
      options: AppleStrategyOptions,
      verify: (
        req: any,
        accessToken: string,
        refreshToken: string,
        idToken: string,
        profile: AppleProfile,
        done: (error: any, user?: any) => void
      ) => void
    );
  }
  
  export = AppleStrategy;
}
