import { Controller, Get, Route, SuccessResponse } from 'tsoa';

@Route('ping')
export class TodoController extends Controller {
  @Get()
  @SuccessResponse('200', 'pong') // Custom success response
  public async getPonge(): Promise<string> {
    return 'pong';
  }
}
