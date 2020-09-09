declare namespace Twitch {
  ////// Enums //////
  enum Anchors {
    component = "component",
    panel = "panel",
    videoOverlay = "video_overlay",
  }

  enum Modes {
    /** The helper was loaded in a viewer context, such as the Twitch channel page. */
    viewer = "viewer",
    /**
     * The helper was loaded into a broadcaster control context, like the live dashboard. Use this mode to present controls that allow
     * the broadcaster to update the extension’s behavior during broadcast.
     */
    dashboard = "dashboard",
    /**
     * The helper was loaded into the extension dashboard for configuration, including initial configuration. All setup needed to run
     * the extension should be in this mode.
     */
    config = "config",
  }

  enum Platforms {
    mobile = "mobile",
    web = "web",
  }

  enum ExtensionStates {
    testing = "testing",
    hostedTest = "hosted_test",
    approved = "approved",
    released = "released",
    readyForReview = "ready_for_review",
    inReview = "in_review",
    pendingAction = "pending_action",
    uploading = "uploading",
  }

  enum PlaybackModes {
    /** Normal video playback. */
    video = "video",
    /** Audio-only mode. Applies only to mobile apps. */
    audio = "audio",
    /** Using a remote display device (e.g., Chromecast). Video statistics may be incorrect or unavailable. */
    remote = "remote",
    /** No video or audio, chat only. Applies only to mobile apps. Video statistics may be incorrect or unavailable. */
    chatOnly = "chat-only",
  }

  enum Themes {
    light = "light",
    dark = "dark",
  }

  /**
   * The target to send a message to or listen for messages from. Not all options are valid for every target argument. Check function docs for details.
   */
  enum Targets {
    /** For messages on the specific channel that is hosting the extension */
    broadcast = "broadcast",
    /** For messages on ALL channels that are hosting the extension */
    global = "global",
    /** For messages to specific users by appending a userId to this Target (e.g. `thisTarget = Targets.whisper + userIdString;`) */
    whisper = "whisper-",
  }

  enum Segments {
    broadcaster = "broadcaster",
    developer = "developer",
    global = "global",
  }

  enum Roles {
    broadcaster = "broadcaster",
    moderator = "moderator",
    viewer = "viewer",
    external = "external",
  }

  enum Tiers {
    one = "1000",
    two = "2000",
    three = "3000",
  }

  ////// Object definitions //////
  interface IAuth {
    /** Channel ID of the page where the extension is iframe embedded. */
    channelId: string;
    /** Client ID of the extension. */
    clientId: string;
    /** JWT that should be passed to any EBS call for authentication. */
    token: string;
    /** Opaque user ID. */
    userId: string;
  }

  interface IHostingInfo {
    /** Numeric ID of the channel being hosted by the currently visible channel */
    hostedChannelId: string;
    /** Numeric ID of the host channel */
    hostingChannelId: string;
  }

  interface IContext {
    /** If true, player controls are visible (e.g., due to mouseover). Do not use this for mobile extensions; it is not sent for mobile. */
    arePlayerControlsVisible: boolean;
    /** Bitrate of the broadcast. */
    bitrate: number;
    /** Buffer size of the broadcast. */
    bufferSize: number;
    /** Display size of the player. */
    displayResolution: string;
    /** Game being broadcast. */
    game: string;
    /** Number of seconds of latency between the broadcaster and viewer. */
    hlsLatencyBroadcaster: number;
    /** Information about the current channel’s hosting status, or undefined if the channel is not currently hosting. */
    hostingInfo?: IHostingInfo;
    /** If true, the viewer is watching in fullscreen mode. Do not use this for mobile extensions; it is not sent for mobile. */
    isFullScreen: boolean;
    /** If true, the viewer has muted the stream. */
    isMuted: boolean;
    /** If true, the viewer has paused the stream. */
    isPaused: boolean;
    /** If true, the viewer is watching in theater mode. Do not use this for mobile extensions; it is not sent for mobile. */
    isTheatreMode: boolean;
    /** Language of the broadcast (e.g., "en"). */
    language: string;
    /** Identifies the context the helper was loaded in: viewer, dashboard, or config. */
    mode: HelperModes;
    /** Indicates how the stream is being played. */
    playbackMode: PlaybackModes;
    /** The user's theme setting on the Twitch website. */
    theme: Themes;
    /** Resolution of the broadcast. */
    videoResolution: string;
    /** Currently selected player volume. Valid values: between 0 and 1. */
    volume: number;
  }

  /**
   * An object indicating the x and y coordinates of the extension. These coordinates are expressed as fixed-point integers (two decimal points)
   * representing the percentage of the player width/height where the top-left corner of the extension is located. For example, a value of `1050`
   *  for `x` indicates the corner of the extension is 10.5% of the player’s width from the left, on the x axis.
   */
  interface IPosition {
    x: number;
    y: number;
  }

  /** Object describing the version of the extension and the content string for the associated configuration. */
  interface IConfigContent {
    version: string;
    content: string;
  }

  interface ICost {
    /** Number of Bits required for the product. */
    amount: string;
    /** Always the string `"bits"`. Reserved for future use. */
    type: string;
  }

  interface IProduct {
    /** Unique ID for the product. */
    sku: string;
    /** Cost object. */
    cost: ICost;
    /** Registered display name for the SKU. */
    displayName: string;
    /**
     * This field is returned only for extension versions that are not in the `Released` state. Valid values:
     * - `true` – Indicates that the product’s catalog entry specifies it is in development. If the developer tests the use of Bits, the Bits are not
     * deducted from the user’s balance.
     * - `false` – Indicates that the product’s catalog entry specifies it is not in development. If the developer tests the use of Bits, the Bits are
     * deducted from the user’s balance.
     * - `undefined` – Indicates that the product’s catalog entry does not specify anything about whether it is in development. If the developer tests
     * the use of Bits, the Bits are deducted from the user’s balance.
     */
    inDevelopment?: boolean;
  }

  interface ISubscriptionStatus {
    tier: Tiers;
  }

  ////// Helper Classes //////
  interface IActions {
    /**
     * This function prompts users to follow the specified channel, with a dialog controlled by Twitch. When users confirm (through the dialog) that they want to follow the channel,
     * the callback registered with `Twitch.ext.actions.onFollow` is invoked.
     * @param channelName Channel to be followed.
     */
    followChannel(channelName: string): void;

    /**
     * This function causes your video-component or video-overlay extension to be minimized.
     */
    minimize(): void;

    /**
     * This function registers a callback that is invoked whenever a user completes an interaction prompted by the `followChannel` action.
     * @param callback Function with two arguments: a boolean that indicates whether users confirm that they want to follow the
     * channel and the name of channel that was followed.
     */
    onFollow(callback: (didFollow: boolean, channelName: string) => void): void;

    /**
     * This function opens a prompt for users to share their identity. After a successful identity link, the `Twitch.ext.onAuthorized` callback is invoked with the user’s ID.
     * This function has no effect if:
     * - Your extension does not have identity linking enabled.
     * - It is called when the extension is installed on the user’s own channel.
     */
    requestIdShare(): void;
  }

  interface IConfiguration {
    /** This property returns the record for the broadcaster segment if one is found; otherwise, undefined. */
    broadcaster: IConfigContent | undefined;
    /** This property returns the record for the developer segment if one is found; otherwise, undefined. */
    developer: IConfigContent | undefined;
    /** This property returns the record for the global segment if one is found; otherwise, undefined. */
    global: IConfigContent | undefined;

    /**
     * This function registers a callback that is called whenever an extension configuration is received. The callback function takes no input and returns nothing.
     * After this is called for the first time, the records for the global, developer and broadcaster segments will be set if the data is available.
     * @param callback function that is called whenever an extension configuration is received.
     */
    onChanged(callback: () => void): void;

    /**
     * This function can be called by the front end to set an extension configuration. It uses the Twitch-provided JWT for broadcasters, to allow broadcasters to set
     * a broadcaster configuration segment.
     * @param segment The configuration segment to set. Only `broadcaster` is accepted.
     * @param version The version of configuration with which the segment is stored.
     * @param content The string-encoded configuration.
     */
    set(segment: Segments, version: string, content: string): void;
  }

  interface IFeatures {
    /**
     * If this flag is `true`, Bits in Extensions features will work in your extension on the current channel.
     * If this flag is `false`, disable or hide the Bits in Extensions features in your extension.
     * This flag will be `false` if:
     * - You did not enable Bits support in the Monetization tab in the Extensions manager.
     * - The broadcaster is not eligible to receive Bits.
     * - The broadcaster disabled Bits in Extensions features for your extension.
     */
    isBitsEnabled: boolean;

    /**
     * If this flag is `true`, you can send a chat message to the current channel using Send Extension Chat Message (subject to the authentication requirements documented
     * for that endpoint). This flag may be `false` if:
     * - You did not enable the “Chat Capabilities” option for your extension on the Twitch developer site.
     * - The broadcaster disabled chat for your extension.
     */
    isChatEnabled: boolean;

    /**
     * If this flag is `true`, your extension has the ability to get the subscription status of identity-linked viewers from both the helper in the
     * `twitch.ext.viewer.subscriptionStatus` object and via the Twitch API.
     * This flag may be `false` if:
     * - You did not enable the “Subscription Status” option for your extension on the Twitch developer site.
     * - The broadcaster did not grant your extension the permission to view their viewer’s subscriber status when they activated the extension, or
     * they revoked that permission from the Manage Permissions page.
     */
    isSubscriptionStatusAvailable: boolean;

    /**
     * This function enables you to receive real-time updates to changes of the `features` object. If this callback is invoked, you should re-check the
     * `Twitch.ext.features` object for a change to any feature flag your extension cares about.
     * @param callback is a function with one argument: an array of feature flags which were updated.
     */
    onChanged(callback: (changes: string[]) => void): void;
  }

  interface IBits {
    /**
     * This function returns a promise which resolves to an array of products available for Bits, for the extension, if the context supports Bits in Extensions
     * actions. Otherwise, the promise rejects with an error; this can occur, for instance, if the extension is running in an older version of the developer rig
     * or an older version of the mobile app (earlier than V6.4), which does not support Bits in Extensions actions. Products are returned only if the extension
     * is configured for Bits (see the Extensions Monetization Guide). The products that are returned depend on the state of both the extension version (whether
     * it is released) and the product (whether the kit is in development).
     */
    getProducts(): Promise<IProduct[]>;

    /**
     * This function takes a callback that is fired whenever a transaction is cancelled. A transaction can be cancelled in several ways:
     * - The user clicks the Cancel button.
     * - The user closes the confirmation dialog by clicking outside it.
     * - The `useBits` function fails and the user dismisses the error dialog that is displayed.
     */
    onTransactionCancelled(callback: () => void): void;

    /**
     * This function registers a callback that is fired whenever a Bits in Extensions transaction is completed.
     */
    onTransactionComplete(callback: (transactionObject: object) => void): void;

    /**
     * This function sets the state of the extension helper, so it does not call live services for usage of Bits. Instead, it does a local loopback to the completion
     * handler, after a fixed delay to simulate user approval and process latency.
     */
    setUseLoopback(): boolean;

    /**
     * Call this function when the viewer hovers over a product in your extension UI, to cause the Twitch UI to display a dialog showing the viewer’s Bits balance.
     * The dialog displays for 1.5 seconds, unless your extension calls `showBitsBalance` again, in which case the 1.5-second timer resets. This is a “fire-and-forget”
     * function: the extension developer does not need to tell Twitch when the viewer stops hovering over the product. On mobile, this function is ignored.
     */
    showBitsBalance(): void;

    /**
     * This function redeems a product with the specified SKU for the number of Bits specified in the catalog entry of that product.
     * @param sku The product to be purchased
     */
    useBits(sku: string): void;
  }

  /**
   * The Twitch.ext.viewer object is a collection of info about the twitch viewer that is watching the channel page where your extension is activated. It will only be
   * populated if the viewer is logged in, and only after the `onAuthorized` callback has been called. Accessing its properties will otherwise return `null`.
   * Much of the information stored here is also present in the extension JWT, and is presented as part of this object for convenience. It is passed to the extension
   * iframe from the client without validation, so it is recommended that you use this info for rendering conditional UI elements, and that you pass the JWT to your EBS
   * for validation if you are using any of this information to grant users permission to take privileged actions within your extension.
   */
  interface IViewer {
    /** The opaque id of the viewer. */
    opaqueId: string;
    /** The Twitch ID of a linked viewer. `null` if the viewer has not opted to share their identity with the extension. */
    id: string | null;
    /** The role of the user. */
    role: Roles;
    /** Provided as a convenience to check whether or not a user has shared their identity with their extension. */
    isLinked: boolean;
    /** The encoded JWT. This is the same as the token property of the `authData` parameter that currently gets passed to the `onAuthorized` callback. */
    sessionToken: string;
    /** Information about the viewer’s subscription. */
    subscriptionStatus: ISubscriptionStatus | null;

    /**
     * This function binds a callback that will be invoked when the viewer’s status changes (e.g. if a viewer subscribes and changes their subscription status).
     */
    onChanged(callback: () => void): void;
  }

  ////// Extension Object //////
  /**
   * The Extension Helper. The overall object that contains the functions, properties, and sub-objects for working with the extension.
   */
  interface ext {
    /** The type of the anchor in which the extension is activated. */
    anchor: Anchors;
    /** The user’s language setting (e.g., `"en"`). */
    language: string;
    /** The user’s language locale (e.g. `"en-US"`). */
    locale: string;
    /** The extension's mode. */
    mode: Modes;
    /** The platform on which the Twitch client is running. */
    platform: Platforms;
    /** Indicates whether the extension is popped out. If `true`, the extension is running in its own window; otherwise, `false`. */
    popout: boolean;
    /** The release state of the extension. */
    state: ExtensionStates;

    /** This encodes the Helper version in 1.1.1 (semantic versioning) format. */
    version: string;
    /** This encodes the environment. For external users, this is always production. */
    environment: string;

    /**
     * This callback is fired each time the JWT is refreshed.
     * @param authCallback is a function with one argument, an IAuth object.
     */
    onAuthorized(authCallback: (auth: IAuth) => void): void;

    /**
     * This callback is fired when the context of an extension is fired.
     * @param contextCallback is a function with two arguments, an `IContext` object and an array of `string`s naming the `IContext` properties that were changed.
     */
    onContext(contextCallback: (context: IContext, delta: string[]) => void): void;

    /**
     * This callback is fired if any errors are generated by the extension helper.
     * @param errorCallback is a function with one argument, the `error` value, when any errors occur within the helper.
     */
    onError(errorCallback: (error: any) => void): void;

    /**
     * This function allows an extension to adjust its visibility when the viewer highlights the extension by hovering over the extension’s menu icon or open menu,
     * in the video player. The function applies only to video-overlay and component Extensions.
     * @param callback A callback that is called with a boolean indicating whether the extension is highlighted by the user.
     */
    onHighlightChanged(callback: (isHighlighted: boolean) => void): void;

    /**
     * This function registers a callback that gets called whenever an extension changes position in the player. This applies only to video-component
     * extensions. This also is triggered as the extension loads.
     * @param callback A function called with an IPosition argument.
     */
    onPositionChanged(callback: (position: IPosition) => void): void;

    /**
     * This function registers a callback that gets called whenever an extension is hidden/re-shown, either due to the viewer’s action or due to extensions hiding due
     * to the video player changing to a state where extensions are not shown (such as when the video pauses or an ad is running). When an extension is not visible, it
     * does not receive `onContext` updates and must perform only minimal work in the background.
     * @param callback A callback that is called with one or two arguments: a boolean indicating whether the extension is visible, and a fresh `IContext` object.
     * The second argument is present only when `isVisible` is true.
     */
    onVisibilityChanged(callback: (isVisible: boolean, context?: IContext) => void): void;

    /**
     * This function can be called by the front end to send directly to PubSub. It uses the Twitch-provided JWT for broadcasters, to allow broadcasters to send a
     * broadcast (channel) or whisper message. Broadcasters cannot send to global.
     * @param target Target topic. Usually this is `"broadcast"` (but it could be `"whisper-<userId>"`).
     * @param contentType Content type of the serialized message; for example, `"application/json".`
     * @param message Either an object that will be automatically serialized as JSON or a string.
     */
    send(target: Targets | string, contentType: string, message: object): void;
    send(target: Targets | string, contentType: string, message: string): void;

    /**
     * This function binds the `callback` to listen to the `target` topic.
     * About non-extension PubSubs: Whispers are a set of optional PubSub channels that extensions can use. Each copy of an extension can register for `"whisper-<userId>"`
     * where `userId` comes from the `onAuthorized` message. Attempts to listen to another userId will be blocked. Once the extension is listening, the EBS or broadcaster can
     * send an individualized message to the channel.
     * @param target Target topic. Usually this is `"broadcast"` or `"global"` (but it could be `"whisper-<userId>"`).
     * If an extension front end listens to `"broadcast"` on a channel, it will receive messages sent to the channel, for that extension/channel combination.
     * If it listens to `"global"`, it will see messages sent to global, for all channels with that extension installed. Non-Extensions PubSub topics also are supported.
     * @param callback Function with three arguments: `target`, `contentType`, and `message`. These fields correspond to the values in the send message, except the message is always a string.
     */
    listen(target: Targets | string, callback: (target: Targets | string, contentType: string, message: string) => void): void;

    /**
     * This function unbinds the listen `callback` from the `target`.
     * @param target Function with three arguments: `target`, `contentType`, and `message`. These fields correspond to the values in the `send` message, except the message is always a string.
     * This must be the original function object from `listen`: passing in a new function or a copy of the original has no effect.
     * @param callback Target topic. Often this is `"broadcast"` but it might be `"whisper-<userId>"`. Non-Extensions PubSub topics also are supported.
     */
    unlisten(target: Targets | string, callback: (target: Targets | string, contentType: string, message: string) => void): void;

    actions: IActions;
    configuration: IConfiguration;
    features: IFeatures;
    bits: IBits;
    viewer: IViewer;
  }
}

export default Twitch;
