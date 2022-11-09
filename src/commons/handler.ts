export interface Handler<Request, Response> {
  execute(request: Request): Response;
}
