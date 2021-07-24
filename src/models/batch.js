'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.PoItem, {
          foreignKey: "po_item",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Stock, {
          foreignKey: "stock",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.TsItem, {
          foreignKey: "ts_item",
        });
        this.belongsTo(models.SrItem, {
          foreignKey: "sr_item",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.CheckedStock, {
          foreignKey: "batch_no",
        });
        this.hasMany(models.Log, {
          foreignKey: "batch_no",
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
  
  Batch.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    po_item: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.PoItem,
        key: 'id',
      }
    },
    stock: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.Stock,
        key: 'id',
      }
    },
    ts_item: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.TsItem,
        key: 'id',
      }
    },
    sr_item: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.SrItem,
        key: 'id',
      }
    },
    barcode: { 
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barcode is required." },
        notNull: { msg: "Barcode is required." },
      },
      unique: { msg: "Barcode already exists." }, //!
    },
    best_before_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Best before date is required." },
        notNull: { msg: "Best before date is required." },
        isDate: { msg: 'Invalid date.' },
      },
      get(){
        const rawValue = this.getDataValue("best_before_date");
        return rawValue != null ? rawValue.slice(0, 10) : '';
      },
    },
    sell_by_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Sell by date is required." },
        notNull: { msg: "Sell by date is required." },
        isDate: { msg: 'Invalid date.' },
      },
      get(){
        const rawValue = this.getDataValue("sell_by_date");
        return rawValue != null ? rawValue.slice(0, 10) : '';
      },
    },
    sku: {/*
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: { msg: "SKU is required." },
        notNull: { msg: "SKU is required." },
      },*/
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Active",
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
    modelName: 'Batch',
    freezeTableName: true,
  }
  );
  return Batch;
};