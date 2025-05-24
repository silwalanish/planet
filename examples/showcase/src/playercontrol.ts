export enum PlayerAction {
  ACCELERATE = "accelerate",
  DECCELERATE = "deccelerate",
}

const KEY_MAPS: Record<string, PlayerAction> = {
  D: PlayerAction.ACCELERATE,
  A: PlayerAction.DECCELERATE,
};

export class PlayerControl {
  private _states: Record<PlayerAction, boolean> = {
    [PlayerAction.ACCELERATE]: false,
    [PlayerAction.DECCELERATE]: false,
  };

  public constructor() {}

  public get isAccelerating() {
    return this._states[PlayerAction.ACCELERATE];
  }

  public get isDeccelerating() {
    return this._states[PlayerAction.DECCELERATE];
  }

  public get isMoving() {
    return this.isAccelerating || this.isDeccelerating;
  }

  public register(action: PlayerAction) {
    this._states[action] = true;
  }

  public unregister(action: PlayerAction) {
    this._states[action] = false;
  }

  public handleKeyDown(key: string) {
    if (KEY_MAPS[key]) {
      this.register(KEY_MAPS[key]);
    }
  }

  public handleKeyUp(key: string) {
    if (KEY_MAPS[key]) {
      this.unregister(KEY_MAPS[key]);
    }
  }
}
