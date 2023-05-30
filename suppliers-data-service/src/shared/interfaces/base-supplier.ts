export class BaseSupplier {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly country: string,
    public readonly vatNumber: number,
    public readonly roles: string[] | undefined,
    public readonly sectors: string[] | undefined,
    public readonly traceId: string,
  ) {}
}
