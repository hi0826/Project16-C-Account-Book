import CategoryModel from '@models/category';
import { User } from '@interfaces/auth';
import AccountBook from '@interfaces/accountbook';
import { AccountBookModel } from './schema';

const get = async ({
  userid,
  social,
}: {
  userid: string;
  social: string;
}): Promise<AccountBook[]> => {
  const accountBooks = await AccountBookModel.find({
    'users.userid': userid,
    'users.social': social,
  });
  return accountBooks;
};

const getDetail = async (id: string): Promise<any> => {
  const accountBook = await AccountBookModel.findOne({
    _id: id,
  });
  return accountBook;
};

const create = async ({
  name,
  description,
  user,
}: {
  name: string;
  description: string;
  user: User;
}): Promise<AccountBook> => {
  const defaultCategory = await CategoryModel.get();
  const information = {
    name,
    description,
    users: [user],
    categories: [...defaultCategory],
    payments: [],
    transactions: [],
  };

  const accountbook = await new AccountBookModel(information).save();
  return accountbook;
};

const update = async (
  _id: string,
  {
    name,
    description,
  }: {
    name: string;
    description: string;
  },
): Promise<any> => {
  const updateData = {
    name,
    description,
  };

  const updateResult = await AccountBookModel.updateOne({ _id }, updateData);
  return !!updateResult.nModified;
};

const del = async (_id: string): Promise<any> => {
  const deleteResult = await AccountBookModel.deleteOne({ _id });
  return !!deleteResult.deletedCount;
};

const addTransaction = async (
  accountBookId: string,
  transaction: any,
): Promise<any> => {
  const curAccountBook = await AccountBookModel.findOne({ _id: accountBookId });
  if (curAccountBook) {
    const curTransactions = curAccountBook.transactions;
    curTransactions.push(transaction);
    const updateResult = await AccountBookModel.update(
      { _id: accountBookId },
      { transactions: [...curTransactions, transaction] },
    );
    if (updateResult.nModified) {
      return curTransactions[curTransactions.length - 1];
    }
    return false;
  }
  return false;
};

const updateTransaction = async (
  accountBookId: string,
  transactionId: string,
  updateInfo: any,
): Promise<any> => {
  const curAccountBook = await AccountBookModel.findOne({ _id: accountBookId });
  if (curAccountBook) {
    const index = curAccountBook.transactions
      .map(value => value._id)
      .indexOf(transactionId);
    curAccountBook.transactions[index] = updateInfo;
    const updateResult = await AccountBookModel.update(
      { _id: accountBookId },
      { transactions: curAccountBook.transactions },
    );
    if (updateResult.nModified) {
      return true;
    }
    return false;
  }
  return false;
};

const deleteTransaction = async (
  accountBookId: string,
  transactionId: string,
): Promise<any> => {
  const curAccountBook = await AccountBookModel.findOne({ _id: accountBookId });
  if (curAccountBook) {
    const index = curAccountBook.transactions
      .map(value => value._id)
      .indexOf(transactionId);
    curAccountBook.transactions.splice(index, 1);
    const updateResult = await AccountBookModel.update(
      { _id: accountBookId },
      { transactions: curAccountBook.transactions },
    );
    if (updateResult.nModified) {
      return true;
    }
    return false;
  }
  return false;
};

export default {
  get,
  getDetail,
  create,
  update,
  del,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
