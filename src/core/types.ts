export interface Handler {
  handle(context: any): any;
  setNextHandler(handler: Handler): Handler;
  sendToNextHandler(context: any): any;
}
