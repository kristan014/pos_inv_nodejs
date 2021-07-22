'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = ["password"];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
        
        // has UserType
        this.hasMany(models.UserType, {
          as: 'user_type',
          foreignKey: "user",
        });

        /*// has UserAccess
        this.hasMany(models.UserAccess, {
          as: 'user_access',
          foreignKey: "user",
        });*/

        // has UserBranch
        this.hasMany(models.UserBranch, {
          as: 'user_branch',
          foreignKey: "user",
        });

        // has LoyaltyCard
        this.hasMany(models.LoyaltyCard, {
          as: 'loyalty_card',
          foreignKey: "customer",
        });
        
        // has PurchaseOrder
        this.hasMany(models.PurchaseOrder, {
          foreignKey: "ordered_by",
        });
        this.hasMany(models.PurchaseOrder, {
          foreignKey: "received_by",
        });

        // has SaleReceipt
        this.hasMany(models.SaleReceipt, {
          foreignKey: "employee",
        });
        this.hasMany(models.SaleReceipt, {
          foreignKey: "customer",
        });
 
        // has Discount
        this.hasMany(models.Discount, {
          as: 'discount',
          foreignKey: "customer",
        });
       
        // has ReturnedProducts
        this.hasMany(models.ReturnedProducts, {
          foreignKey: "customer",
        });
    
        // has ReturnedOrder
        this.hasMany(models.ReturnedOrder, {
          foreignKey: "employee",
        });
      
        // has TransferredStocks
        this.hasMany(models.TransferredStocks, {
          foreignKey: "transferrer",
        });
        this.hasMany(models.TransferredStocks, {
          foreignKey: "receiver",
        });

        this.hasMany(models.UserBranch, {
          foreignKey: "created_by",
        });
        this.hasMany(models.UserBranch, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.UserType, {
          foreignKey: "created_by",
        });
        this.hasMany(models.UserType, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Role, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Role, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.UserAccess, {
          foreignKey: "created_by",
        });
        this.hasMany(models.UserAccess, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Access, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Access, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.LoyaltyCard, {
          foreignKey: "created_by",
        });
        this.hasMany(models.LoyaltyCard, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.LoyaltyCardSetup, {
          foreignKey: "created_by",
        });
        this.hasMany(models.LoyaltyCardSetup, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.LoyaltyCardLog, {
          foreignKey: "created_by",
        });
        this.hasMany(models.LoyaltyCardLog, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Branch, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Branch, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Supplier, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Supplier, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.SupplierProduct, {
          foreignKey: "created_by",
        });
        this.hasMany(models.SupplierProduct, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Product, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Product, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Category, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Category, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.PurchaseOrder, {
          foreignKey: "created_by",
        });
        this.hasMany(models.PurchaseOrder, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.PoItem, {
          foreignKey: "created_by",
        });
        this.hasMany(models.PoItem, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Stock, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Stock, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Batch, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Batch, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.CheckedStock, {
          foreignKey: "created_by",
        });
        this.hasMany(models.CheckedStock, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Log, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Log, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Tax, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Tax, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.TaxSetup, {
          foreignKey: "created_by",
        });
        this.hasMany(models.TaxSetup, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.SaleReceipt, {
          foreignKey: "created_by",
        });
        this.hasMany(models.SaleReceipt, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.SrItem, {
          foreignKey: "created_by",
        });
        this.hasMany(models.SrItem, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.Discount, {
          foreignKey: "created_by",
        });
        this.hasMany(models.Discount, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.DiscountSetup, {
          foreignKey: "created_by",
        });
        this.hasMany(models.DiscountSetup, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.ReturnedProducts, {
          foreignKey: "created_by",
        });
        this.hasMany(models.ReturnedProducts, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.RpItem, {
          foreignKey: "created_by",
        });
        this.hasMany(models.RpItem, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.ReturnedOrder, {
          foreignKey: "created_by",
        });
        this.hasMany(models.ReturnedOrder, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.RoItem, {
          foreignKey: "created_by",
        });
        this.hasMany(models.RoItem, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.TransferredStocks, {
          foreignKey: "created_by",
        });
        this.hasMany(models.TransferredStocks, {
          foreignKey: "updated_by",
        });
        this.hasMany(models.TsItem, {
          foreignKey: "created_by",
        });
        this.hasMany(models.TsItem, {
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
  
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profile_pic: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("profile_pic");
        return rawValue ? "public/" + rawValue : null;
      },  
    }, 
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email address is required." },
        notNull: { msg: "Email address is required." },
        isEmail: { msg: "Invalid email address." },
        async isUnique(value) {
          const email = await User.findOne({
            where: { email: value }
          });
          if (email) {
            throw new Error('Email address already exists');
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required." },
        notNull: { msg: "Password is required." },
      },
    },
    contact_no: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Contact no. is required." },
          notNull: { msg: "Contact no. is required." },
          isNumeric: { msg: "Invalid contact no." },
          len: {
            args: [10,11],
            msg: "Must be 10-11 character long." 
          },
        },
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name is required." },
        notNull: { msg: "First name is required." },
      },
    },
    middle_name: {
        type: DataTypes.STRING(50),
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Last name is required." },
          notNull: { msg: "Last name is required." },
        },
    },
    full_name: {
      type: DataTypes.STRING(150),
      set(value) {
        this.setDataValue(
          "full_name",
          this.first_name + " " + (this.middle_name ? this.middle_name + " " : "") + this.last_name
        );
      },
    },
    gender: {
      type: DataTypes.STRING(50),
      defaultValue: "Female",
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid gender." },
        isIn: [["Male", "Female", "Other"]],
      },
      /*
      get(){
        const rawValue = this.getDataValue("gender");
        return rawValue ? rawValue.toUpperCase() : null;
      },
      */
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Birth date is required." },
        notNull: { msg: "Birth date is required." },
        isDate: { msg: "Invalid birth date." },
        isBefore: {
          args: '2015-01-01',
          msg: 'Invalid birth date.',
        },
      },
    },
    /*date_hired: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
          notNull: { msg: "Invalid date hired." },
          isDate: { msg: "Invalid date hired." },
          isBefore: {
            args: new Date().toISOString(),
            msg: 'Invalid date hired.',
          },
        },
    },*/
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
          model: User,
          key: "id",
      }
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
          model: User,
          key: "id",
      }
    },
  }, 
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'User',
    freezeTableName: true,
  }
  );
  return User;
};