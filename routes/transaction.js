var express = require("express");
const { connectDb, closeConnection } = require("../config");
const { authenticate } = require("../lib/authorize");
var router = express.Router();
const mongodb = require("mongodb");

router.post("/income/add", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    await db
      .collection("income")
      .insertOne({ ...req.body, createdAt: new Date() });
    res.json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/income", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let incomeData = await db.collection("income").find().toArray();
    res.json(incomeData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/income/:incomeId", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let incomeData = await db
      .collection("income")
      .findOne({ _id: mongodb.ObjectId(req.params.incomeId) });
    if (incomeData) {
      delete incomeData._id;
      delete incomeData.createdAt;
      res.json(incomeData);
    } else {
      res.status(404).json({ message: "Income not found" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.put("/income/:incomeId", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    const incomeData = await db
      .collection("income")
      .findOne({ _id: mongodb.ObjectId(req.params.incomeId) });
    if (incomeData) {
      const updatedIncome = await db
        .collection("income")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.incomeId) },
          { $set: req.body }
        );
      res.json(updatedIncome);
    } else {
      res.status(404).json({ message: "Income not found" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/weekly-income", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$incomeAmt",
          },
        },
      },
    ];
    let weeklyIncomeData = await db
      .collection("income")
      .aggregate(pipeline)
      .toArray();
    res.json(weeklyIncomeData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/monthly-income", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$incomeAmt",
          },
        },
      },
    ];
    let monthlyIncomeData = await db
      .collection("income")
      .aggregate(pipeline)
      .toArray();
    res.json(monthlyIncomeData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/yearly-income", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$incomeAmt",
          },
        },
      },
    ];
    let yearlyIncomeData = await db
      .collection("income")
      .aggregate(pipeline)
      .toArray();
    res.json(yearlyIncomeData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/overall-income", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $group: {
          _id: null,
          total: {
            $sum: "$incomeAmt",
          },
        },
      },
    ];
    let overallIncomeData = await db
      .collection("income")
      .aggregate(pipeline)
      .toArray();
    res.json(overallIncomeData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.post("/expense/add", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    await db
      .collection("expense")
      .insertOne({ ...req.body, createdAt: new Date() });
    res.json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/expense", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let query = req.query;
    let filters = {};
    Object.keys(query).forEach((key) => {
      filters[key] = query[key];
    });
    let expenseData = await db.collection("expense").find(filters).toArray();
    res.json(expenseData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/expense/:expenseId", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let expenseData = await db
      .collection("expense")
      .findOne({ _id: mongodb.ObjectId(req.params.expenseId) });
    if (expenseData) {
      delete expenseData._id;
      delete expenseData.createdAt;
      res.json(expenseData);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.put("/expense/:expenseId", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    const expenseData = await db
      .collection("expense")
      .findOne({ _id: mongodb.ObjectId(req.params.expenseId) });
    if (expenseData) {
      const updatedExpense = await db
        .collection("expense")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.expenseId) },
          { $set: req.body }
        );
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/weekly-expense", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$expenseAmt",
          },
        },
      },
    ];
    let weeklyExpenseData = await db
      .collection("expense")
      .aggregate(pipeline)
      .toArray();
    res.json(weeklyExpenseData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/monthly-expense", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$expenseAmt",
          },
        },
      },
    ];
    let monthlyExpenseData = await db
      .collection("expense")
      .aggregate(pipeline)
      .toArray();
    res.json(monthlyExpenseData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/yearly-expense", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $match: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$expenseAmt",
          },
        },
      },
    ];
    let yearlyExpenseData = await db
      .collection("expense")
      .aggregate(pipeline)
      .toArray();
    res.json(yearlyExpenseData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

router.get("/overall-expense", authenticate, async function (req, res) {
  try {
    const db = await connectDb();
    let pipeline = [
      {
        $group: {
          _id: null,
          total: {
            $sum: "$expenseAmt",
          },
        },
      },
    ];
    let overallExpenseData = await db
      .collection("expense")
      .aggregate(pipeline)
      .toArray();
    res.json(overallExpenseData);
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
});

module.exports = router;
