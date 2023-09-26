import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountsRepository.create({
      data: {
        ...createBankAccountDto,
        userId,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAccountsRepository.findAllByUserId({
      where: { userId },
      include: {
        transactions: {
          select: {
            value: true,
            type: true,
          },
        },
      },
    });

    return bankAccounts.map((bankAccount) => {
      const { transactions, ...rest } = bankAccount;

      const totalTransactions = transactions.reduce((acc, curr) => {
        if (curr.type === 'INCOME') {
          return acc + curr.value;
        }

        return acc - curr.value;
      }, 0);

      const currentBalance = bankAccount.initialBalance + totalTransactions;

      return {
        ...rest,
        currentBalance,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    return this.bankAccountsRepository.update({
      where: { id: bankAccountId },
      data: updateBankAccountDto,
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccountsRepository.delete({
      where: { id: bankAccountId },
    });
  }
}
