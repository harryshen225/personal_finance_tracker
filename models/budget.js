module.exports = function (sequelize, DataTypes) {
    var Budget = sequelize.define("Budget", {
        // Giving the Author model a name of type STRING
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cadence: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    Budget.associate = function (models) {
        Budget.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Budget;
};