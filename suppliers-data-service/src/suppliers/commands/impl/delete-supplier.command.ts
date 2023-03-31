export class DeleteSupplierCommand {
  constructor(public readonly id: string, public readonly traceId: string) {}
}
