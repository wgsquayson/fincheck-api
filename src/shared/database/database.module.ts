import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountsRepository } from './repositories/bank-accounts.repositories';
import { TransactionsRepository } from './repositories/transactions.repository';

const providers = [
  UsersRepository,
  CategoriesRepository,
  BankAccountsRepository,
  TransactionsRepository,
];

@Global()
@Module({
  providers: [PrismaService, ...providers],
  exports: providers,
})
export class DatabaseModule {}
