export interface ITransaction {
  readonly accountExternalIdDebit: string
  readonly accountExternalIdCredit: string
  readonly tranferTypeId: number
  readonly value: number
}
