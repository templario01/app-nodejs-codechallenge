import { BrokerBootstrap } from '../../bootstrap/broker.bootstrap'
import { EnvConfig } from '../../core/utils/env-config'
import { logger } from '../../core/utils/logger'
import { BrokerRepository } from '../domain/repositories/broker.repository'
import { RecevierMessageService } from './services/receiver-message.service'

export class BrokerInfrastructure implements BrokerRepository {
  private kafkaTopicAntifraud: string
  private kafkaTopicTransac: string
  constructor() {
    this.kafkaTopicAntifraud = EnvConfig.kafkaTopicAntifraud
    this.kafkaTopicTransac = EnvConfig.kafkaTopicTransac
  }
  async send(payload: unknown): Promise<void> {
    const messageBuffer = Buffer.from(JSON.stringify(payload))

    await BrokerBootstrap.pruducer.connect()
    await BrokerBootstrap.pruducer.send({
      topic: this.kafkaTopicAntifraud,
      messages: [{ value: messageBuffer }],
    })

    logger.info(`message sent: ${messageBuffer}`)

    await BrokerBootstrap.pruducer.disconnect()
  }
  async receive(): Promise<void> {
    await BrokerBootstrap.consumer.connect()
    await BrokerBootstrap.consumer.subscribe({ topic: this.kafkaTopicTransac, fromBeginning: true })
    await BrokerBootstrap.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.info(`message received => topic: ${topic}, partition: ${partition}, offset: ${message.offset}`)

        RecevierMessageService.receiveMessage(message)
      },
    })
  }
}
