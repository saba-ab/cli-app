#!/usr/bin/env node

const { Command } = require("commander");
const { writeFile, readFile } = require("fs/promises");
const path = require("path");

const program = new Command();
const budgetFile = path.join(__dirname, "budget.json");

const defineBudget = async () => {
  console.log("creating wallet");
  const dataExample = {
    budget: 0,
    transactions: [],
  };
  await writeFile(budgetFile, JSON.stringify(dataExample));
  return dataExample;
};

const getBudget = async () => {
  try {
    const budgetData = await readFile(budgetFile, "utf8");
    return JSON.parse(budgetData);
  } catch (err) {
    return await defineBudget();
  }
};

const manageBudget = async (type, amount) => {
  let transaction = {
    id: 0,
    transactionType: type,
    amount: amount,
  };
  try {
    amount = parseInt(amount);
    const wallet = await getBudget();
    if (type === "add") {
      wallet.budget += amount;
      if (wallet.transactions.length === 0) {
        wallet.transactions.push({
          ...transaction,
          id: 1,
        });
      } else {
        wallet.transactions.push({
          ...transaction,
          id: wallet.transactions[wallet.transactions.length - 1].id + 1,
        });
      }
    }
    if (type === "spend") {
      wallet.budget -= amount;
      if (wallet.transactions.length === 0) {
        wallet.transactions.push({
          ...transaction,
          id: 1,
        });
      } else {
        wallet.transactions.push({
          ...transaction,
          id: wallet.transactions[wallet.transactions.length - 1].id + 1,
        });
      }
    }
    await writeFile(budgetFile, JSON.stringify(wallet));
  } catch (err) {
    console.log(err);
  }
};
const showWallet = async () => {
  const wallet = await getBudget();
  console.log(wallet);
};

program.version("1.0.0");

program
  .command("wallet <type> <amount>")
  .description("manage your budget")
  .action(async (type, amount) => {
    await manageBudget(type, amount);
  });

program
  .command("show wallet")
  .description("show wallet and transactions")
  .action(async () => {
    await showWallet();
  });

program.parse(process.argv);
