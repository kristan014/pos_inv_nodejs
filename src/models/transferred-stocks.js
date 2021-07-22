'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class TransferredStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: "transferrer",
        });
        this.belongsTo(models.User, {
          foreignKey: "receiver",
        });
        this.belongsTo(models.Branch, {
          foreignKey: "from_branch",
        });
        this.belongsTo(models.Branch, {
          foreignKey: "to_branch",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.TsItem, {
          as: 'ts_item',
          foreignKey: 'transferred_stocks',
        });
    }
    
    toJSON() {
      const attrs = { ...this.get() };
      for (const a of PROTECTED_ATTRS){
        delete attrs[a];
      }
      return attrs;
     /* return { 
        ...this.get(), 
        password: undefined 
      }; */
    }
  };
  
  TransferredStocks.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transferrer: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.User,
            key: "id",
        }
    },
    receiver: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.User,
            key: "id",
        }
    },
    from_branch: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Branch,
            key: "id",
        }
    },
    to_branch: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Branch,
            key: "id",
        }
    },
    date_shipped: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    date_expected: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    date_received: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    frieght: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateFrieght (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    note: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Inactive",
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: 'id',
      }
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: 'id',
      }
    },
  }, 
  {
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'TransferredStocks',
    tableName: 'transferred_stocks',
  }
  );
  return TransferredStocks;
};