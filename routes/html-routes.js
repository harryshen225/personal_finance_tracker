const db = require("../models");
const moment = require("moment");


function preciseRound(num, dec) {

  if ((typeof num !== 'number') || (typeof dec !== 'number'))
    return false;

  var num_sign = num >= 0 ? 1 : -1;

  return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
}

async function getAccountDetails(userId){
  const dbBudget = await db.Budget.findAll({ where: { UserId: userId } });
    const data = {};
    dbBudget.slice(1).forEach(element => {
      data[element.category] = {
        budgetAmount: element.amount * (-1),
        monthExpAmount: 0,
        monthUtil: 0,
        dailyUtil: 0,
        status: 0
      }
    });

    const dbBudgetExpense = await db.Expense.findAll({
      include: [db.Budget],
      where: {
        UserId: userId
      }
    });

    dbBudgetExpense.forEach(element => {
      data[element.Budget.category].monthExpAmount += element.amount;
      data[element.Budget.category].monthUtil =  preciseRound(data[element.Budget.category].monthExpAmount / data[element.Budget.category].budgetAmount * 100,2);
      data[element.Budget.category].dailyUtil =  preciseRound((data[element.Budget.category].monthExpAmount/(moment().diff(moment().startOf('month'),"days")+1)) / (data[element.Budget.category].budgetAmount/(moment().endOf('month').diff(moment().startOf('month'),"days")+1)) * 100,2);
      if(data[element.Budget.category].monthUtil > 100){
        data[element.Budget.category].status = 'Over-spending'
      }else if(data[element.Budget.category].monthUtil > 90){
        data[element.Budget.category].status = 'About to reach the limit'
      }
      else{
        data[element.Budget.category].status = 'Under-Budget'
      }
    })

    return data;
}

module.exports = function (app) {
  //define all routes handling function here

  app.get("/", checkNotAuthenticated, function (req, res) {
    res.render("login");
  })

  app.get("/signup", function (req, res) {
    res.render("signup");
  })

  app.get("/login", checkNotAuthenticated, function (req, res) {
    res.render("login");
  })

  app.get("/index", checkAuthenticated, async function (req, res) {
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    // const dbBudget = await db.Budget.findAll({ where: { UserId: req.user.id } });
    // const data = {};
    // dbBudget.slice(1).forEach(element => {
    //   data[element.category] = {
    //     budgetAmount: element.amount * (-1),
    //     monthExpAmount: 0,
    //     monthUtil: 0,
    //     dailyUtil: 0,
    //     status: 0
    //   }
    // });

    // const dbBudgetExpense = await db.Expense.findAll({
    //   include: [db.Budget],
    //   where: {
    //     UserId: req.user.id
    //   }
    // });

    // dbBudgetExpense.forEach(element => {
    //   data[element.Budget.category].monthExpAmount += element.amount;
    //   data[element.Budget.category].monthUtil =  preciseRound(data[element.Budget.category].monthExpAmount / data[element.Budget.category].budgetAmount * 100,2);
    //   data[element.Budget.category].dailyUtil =  preciseRound((data[element.Budget.category].monthExpAmount/(moment().diff(moment().startOf('month'),"days")+1)) / (data[element.Budget.category].budgetAmount/(moment().endOf('month').diff(moment().startOf('month'),"days")+1)) * 100,2);
    //   if(data[element.Budget.category].monthUtil > 100){
    //     data[element.Budget.category].status = 'Over-spending'
    //   }else if(data[element.Budget.category].monthUtil > 90){
    //     data[element.Budget.category].status = 'About to reach the limit'
    //   }
    //   else{
    //     data[element.Budget.category].status = 'Under-Budget'
    //   }
    // })

    const data = await getAccountDetails(req.user.id)
    console.log(data);
    res.render("index", {
      name: userName,
      homeUtil: data["homeUtil"],
      groceries: data["groceries"],
      transport: data["transport"],
      entEatout: data["entEatout"]
    });
  })

  app.get("/budget", checkAuthenticated, async function (req, res) {
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    const data = await getAccountDetails(req.user.id)
    res.render("budget", {
      name: userName,
      homeUtil: data["homeUtil"],
      groceries: data["groceries"],
      transport: data["transport"],
      entEatout: data["entEatout"]
    });
  })

  app.get("/expenses", checkAuthenticated, async function (req, res) {
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    const userId = req.user.id;
    const dbCategories = await db.Budget.findAll({ where: { UserId: userId } });
    const dbResponse = await db.Expense.findAll({ where: { UserId: userId } });

    const categories = {}
    dbCategories.forEach(element => {
      categories[element.category] = element.id
    });

    const data = await getAccountDetails(req.user.id)
    res.render("expense", {
      name: userName,
      categories: categories,
      expenseRecords: dbResponse,
      homeUtil: data["homeUtil"],
      groceries: data["groceries"],
      transport: data["transport"],
      entEatout: data["entEatout"]
    });
  })

  app.get("/insights", checkAuthenticated, function (req, res) {
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    const userId = req.user.id;
    console.log(userId);

    res.render("insights", { name: userName });
  })

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/index')
    }
    next()
  }
}