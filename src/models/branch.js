'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
  
        this.hasMany(models.UserBranch, {
          as: 'user_branch',
          foreignKey: 'branch',
        });
        this.hasMany(models.PurchaseOrder, {
          foreignKey: 'branch',
        });
        this.hasMany(models.Stock, {
          foreignKey: 'branch',
        });
        this.hasMany(models.SaleReceipt, {
          foreignKey: 'branch',
        });
        this.hasMany(models.ReturnedProducts, {
          foreignKey: 'branch',
        });
        this.hasMany(models.ReturnedOrder, {
          foreignKey: 'branch',
        });
        this.hasMany(models.TransferredStocks, {
          foreignKey: 'from_branch',
        });
        this.hasMany(models.TransferredStocks, {
          foreignKey: 'to_branch',
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
  
  Branch.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    branch_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Branch name is required." },
        notNull: { msg: "Branch name is required." },
        async isUnique(value) {
          const branch_name = await Branch.findOne({
            where: { branch_name: value }
          });
          if (branch_name) {
            throw new Error('Branch name already exists');
          }
        },
      },
    },
    contact_no: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Contact no. is required." },
          notNull: { msg: "Contact no. is required." },
          isNumeric: { msg: "Invalid contanct no." },
          len: {
            args: [10,11],
            msg: "Must be 10-11 character long." 
          },
          async isUnique(value) {
            const contact_no = await Branch.findOne({
              where: { contact_no: value }
            });
            if (contact_no) {
              throw new Error('Contact no. already exists');
            }
          },
        },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email address is required." },
        notNull: { msg: "Email address is required." },
        isEmail: { msg: 'Invalid email address.'},
        async isUnique(value) {
          const email = await Branch.findOne({
            where: { email: value }
          });
          if (email) {
            throw new Error('Email address already exists');
          }
        },
      },
    },
    unit_or_floor_no: {
      type: DataTypes.STRING(10),
    },
    house_or_bldg_name: {
      type: DataTypes.STRING(50),
    },
    street_no: {
      type: DataTypes.STRING(10),
    },
    street_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street name is required." },
        notNull: { msg: "Street name is required." },
      },
    },
    barangay: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barangay is required." },
        notNull: { msg: "Barangay is required." },
      },
    },
    city: {
      type: DataTypes.STRING(50),
      defaultValue: "Quezon City",
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required." },
        notNull: { msg: "City is required." },
      },
    },
    zip_code: {
      type: DataTypes.STRING(10),
    },
    region: {
      type: DataTypes.STRING(50),
      defaultValue: "Metro Manila",
      allowNull: false,
      validate: {
        notEmpty: { msg: "Region is required." },
        notNull: { msg: "Region is required." },
      },
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
    indexes: [
      {
        unique: true,
        fields: ['branch_name', 'contact_no', 'email'],
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'Branch',
    freezeTableName: true,
  }
  );
  return Branch;
};