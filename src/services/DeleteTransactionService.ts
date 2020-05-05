import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    try {
      await transactionRepository.findOne(id);

      await transactionRepository.delete(id);
    } catch (error) {
      throw new AppError('The transactions does not exist');
    }
  }
}

export default DeleteTransactionService;
