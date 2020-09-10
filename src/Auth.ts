import * as Jwt from "jsonwebtoken";
import { Roles } from "./twitch-ext";

interface IAuthState {
  token?: string;
  opaqueId?: string;
  userId?: string;
  role?: Roles;
  isBroadcaster: boolean;
}

export class Auth {
  private _authState: IAuthState;

  constructor() {
    this._authState = {
      token: undefined,
      opaqueId: undefined,
      userId: undefined,
      role: undefined,
      isBroadcaster: false,
    };
  }

  /**
   * Public accessor to see if the current user is the channel broadcaster.
   */
  public isBroadcaster() {
    return this._authState.isBroadcaster;
  }

  /**
   * Public accessor to get this user's ID from Twitch.
   */
  public getUserId() {
    return this._authState.userId;
  }

  /**
   * Validates and saves the token retrieved from Twitch
   * @param token Token from Twitch
   * @param opaqueId Opaque User ID from Twitch
   */
  public setToken(token: string, opaqueId: string) {
    let isCaster = false;
    let userRole = Roles.viewer;
    let userId = "";
    let currentToken: string | undefined = token;
    let currentOpaqueId: string | undefined = opaqueId;

    try {
      const decoded = Jwt.decode(token);
      if (!decoded || typeof decoded !== "object") {
        throw new Error("Invalid token");
      }

      if (decoded.role === Roles.broadcaster) {
        isCaster = true;
      }
      userId = decoded.user_id;
      userRole = decoded.role;
    } catch (error) {
      // Invalidate token
      currentToken = undefined;
      currentOpaqueId = undefined;
    }

    // Update the state
    this._authState = {
      token: currentToken,
      opaqueId: currentOpaqueId,
      isBroadcaster: isCaster,
      userId: userId,
      role: userRole,
    };
  }

  /**
   * Has the extension been authenticated with Twitch yet?
   */
  public isAuthenticated() {
    if (this._authState.token && this._authState.opaqueId) {
      return true;
    } else {
      return false;
    }
  }
}
