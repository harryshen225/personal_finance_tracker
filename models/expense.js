const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
    var Expense = sequelize.define("Expense", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            get: function() {
                return moment.utc(this.getDataValue('date')).format('DD/MM/YYYY');
            }
        },
        class: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Expense.associate = function (models) {
        Expense.belongsTo(models.Budget, {
            foreignKey: {
                allowNull: false
            }
        });
        Expense.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    
    return Expense;
};

