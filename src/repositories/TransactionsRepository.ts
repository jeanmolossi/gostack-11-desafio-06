import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const initialBalance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transacions = await this.find();
    const { income, outcome } = transacions.reduce(
      (balance: Balance, currentTransaction: Transaction): Balance => {
        switch (currentTransaction.type) {
          case 'income': {
            balance.income += Number(currentTransaction.value);
            break;
          }
          case 'outcome': {
            balance.outcome += Number(currentTransaction.value);
            break;
          }
          default:
            break;
        }

        return balance;
      },
      initialBalance,
    );
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
