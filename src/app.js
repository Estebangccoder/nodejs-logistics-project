import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import routerWarehouse from "./routes/warehouse.js";
import routerShipment from "./routes/shipment.js";
import routerDriver from "./routes/driver.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3010

app.use(express.json()); // Middleware para convertir el cuerpo de las solicitudes a json
app.use("/warehouse", routerWarehouse);
app.use("/shipment", routerShipment);
app.use("/driver", routerDriver)

app.use(errorHandler); // Middleware para errores
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`); // Logueamos el mensaje en consola cuando el servidor se inicie.
}); // Aqui tenemos el escuchador del puerto para comprobar que esté corriendo
    