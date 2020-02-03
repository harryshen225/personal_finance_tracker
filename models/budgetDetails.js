module.exports = function (sequelize, DataTypes) {
    var BudgetDetails = sequelize.define("BudgetDetails", {
        name: {
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
        cadence: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    BudgetDetails.associate = function (models) {
        BudgetDetails.belongsTo(models.Budget, {
            foreignKey: {
                allowNull: false
            }
        });

        BudgetDetails.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return BudgetDetails;
};

