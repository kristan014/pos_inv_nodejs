const express = require("express");
const dotenv = require("dotenv");
const db = require("./src/models");
const jwt = require("jsonwebtoken"); 
const path = require("path"); 
const cors = require("cors"); 

const userRoute = require("./src/routes/user.route");
const loginRoute = require("./src/routes/login.route"); 
const customerRoute = require("./src/routes/customer.route"); 
const passwordResetRoute = require("./src/routes/password-reset.route"); 
const supplierRoute = require("./src/routes/supplier.route"); 
const branchRoute = require("./src/routes/branch.route"); 
const categoryRoute = require("./src/routes/category.route"); 
const roleRoute = require("./src/routes/role.route");
const accessRoute = require("./src/routes/access.route"); 
const subAccessRoute = require("./src/routes/sub-access.route"); 
const loyaltyCardSetupRoute = require("./src/routes/loyalty-card-setup.route");
const loyaltyCardRoute = require("./src/routes/loyalty-card.route");
const discountSetupRoute = require("./src/routes/discount-setup.route");
const discountRoute = require("./src/routes/discount.route");
const taxSetupRoute = require("./src/routes/tax-setup.route");
const productRoute = require("./src/routes/product.route");
const supplierProductRoute = require("./src/routes/supplier-product.route");
const purchaseOrderRoute = require("./src/routes/purchase-order.route");
const returnedOrderRoute = require("./src/routes/returned-order.route");
const returnedProductsRoute = require("./src/routes/returned-products.route");
const saleReceiptRoute = require("./src/routes/sale-receipt.route");
const transferredStocksRoute = require("./src/routes/transferred-stocks.route");

const batchRoute = require("./src/routes/batch.route"); 

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}.`);

    await db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connected.");
    })
    .catch((err) => {
        console.log("Error:", err);
    });

    if(process.env.ALLOW_SYNC === "true") {
        await db.sequelize
        .sync({ alter: true })
        .then(() => {
            console.log("Success");
        }).catch((err) => {
            console.log("Error:", err);
        });
    }
});

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static(__dirname + "/public"));

// all request will go here first (middleware)
app.use(cors());
app.use((req, res, next) => {
	// you can check session here
	// console.log("Request has been sent!");

	next();
});

app.use((request, response, next) => { // !
    console.log("Request has been sent to " + request.url);
    next();
});

app.get('/', (requst, response) => { // !
   console.log({ message: "Welcome to SAS API demo." }); 
});

process.env.TOKEN_SECRET = require("crypto").randomBytes(64).toString("hex");
const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // 401 - unauthorized 
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};

app.use('/public', express.static(path.join(__dirname + "/public/uploads/")));

app.use(`${process.env.API_VERSION}/login`, loginRoute);
app.use(`${process.env.API_VERSION}/customer`, customerRoute);
app.use(`${process.env.API_VERSION}/password-reset`, passwordResetRoute);
app.use(`${process.env.API_VERSION}/user`, authToken, userRoute);
app.use(`${process.env.API_VERSION}/supplier`, authToken, supplierRoute);
app.use(`${process.env.API_VERSION}/branch`, authToken, branchRoute);
app.use(`${process.env.API_VERSION}/category`, authToken, categoryRoute);
app.use(`${process.env.API_VERSION}/role`, authToken, roleRoute);
app.use(`${process.env.API_VERSION}/access`, authToken, accessRoute);
app.use(`${process.env.API_VERSION}/sub-access`, authToken, subAccessRoute);
app.use(`${process.env.API_VERSION}/loyalty-card-setup`, authToken, loyaltyCardSetupRoute);
app.use(`${process.env.API_VERSION}/loyalty-card`, authToken, loyaltyCardRoute);
app.use(`${process.env.API_VERSION}/discount-setup`, authToken, discountSetupRoute);
app.use(`${process.env.API_VERSION}/discount`, authToken, discountRoute);
app.use(`${process.env.API_VERSION}/tax-setup`, authToken, taxSetupRoute);
app.use(`${process.env.API_VERSION}/product`, authToken, productRoute);
app.use(`${process.env.API_VERSION}/supplier-product`, authToken, supplierProductRoute);
app.use(`${process.env.API_VERSION}/purchase-order`, authToken, purchaseOrderRoute);
app.use(`${process.env.API_VERSION}/returned-order`, authToken, returnedOrderRoute);
app.use(`${process.env.API_VERSION}/returned-products`, authToken, returnedProductsRoute);
app.use(`${process.env.API_VERSION}/sale-receipt`, authToken, saleReceiptRoute);
app.use(`${process.env.API_VERSION}/transferred-stocks`, authToken, transferredStocksRoute);

app.use(`${process.env.API_VERSION}/batch`, authToken, batchRoute);


