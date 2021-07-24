'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class RoItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.ReturnedOrder, {
          foreignKey: "returned_order",
        });
        this.belongsTo(models.PoItem, {
          foreignKey: "po_item",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
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
  
  RoItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    returned_order: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.ReturnedOrder,
            key: "id",
        }
    },
    po_item: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.PoItem,
            key: "id",
        }
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Qty is required." },
        notNull: { msg: "Qty is required." },
        validateQty (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    is_defective: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      validate: {
        notNull: { msg: 'Invalid.' },
      },
    },
    replacement_type: {
      type: DataTypes.STRING(10),
      defaultValue: 'new item',
      allowNull: false,
      validate: {
        notNull: { msg: 'Invalid.' },
        isIn: [['new item','money']],
      },
    },
    reason: {
      type:DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Reason is required." },
        notNull: { msg: "Reason is required." },
      },
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
    modelName: 'RoItem',
    tableName: 'ro_item',
  }
  );
  return RoItem;
};