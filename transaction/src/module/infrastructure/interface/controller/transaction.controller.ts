import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { TransactionApplication } from '../../../application/transaction.application'

import { CreateTransactionRequest } from '../dtos/request/create-transaction.request'
import { TransactionResponse } from '../dtos/response/transaction.response'

export class TransactionController {
  constructor(private readonly transactionApplication: TransactionApplication) {
    this.createTransaction = this.createTransaction.bind(this)
    this.getTransaction = this.getTransaction.bind(this)
  }

  public async getTransaction(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const transaction = await this.transactionApplication.getTransaction(id)

    res.send({ transaction: plainToInstance(TransactionResponse, transaction) })
  }

  public async createTransaction(req: Request, res: Response): Promise<void> {
    const request = plainToInstance(CreateTransactionRequest, req.body)
    await request.isValid()
    const transaction = await this.transactionApplication.registerTransaction(req.body)

    res.send({ transaction: plainToInstance(TransactionResponse, transaction) })
  }
}
