import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Invalid transaction type');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('You dont have enought balance');
    }

    const categoryRepository = getRepository(Category);
    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let transactionCategory = categoryExists;

    if (!categoryExists) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    const transaction = await transactionsRepository.save(newTransaction);

    return transaction;
  }
}

export default CreateTransactionService;
