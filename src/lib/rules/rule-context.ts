export class RuleContext {
  protected _parameters: Record<string, unknown> = {};
  protected _isAborted = false;

  get parameters() {
    return this._parameters;
  }

  //
  // Summary:
  //     Gets a value indicating whether this rule execution is aborted.
  //
  // Value:
  //     true if this rule execution is aborted; otherwise, false.
  get isAborted() {
    return this._isAborted;
  }

  //
  // Summary:
  //     Gets a value indicating the current rule should be skipped.
  skipRule = false;

  //
  // Summary:
  //     Aborts the current rule execution.
  abort(): void {
    this._isAborted = true;
  }
}
