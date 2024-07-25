import {Router} from "express";
import {promises as fs} from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shipmentPath = path.join(__dirname, "../../data/shipment.json");
const routerShipment = Router();

const readShipment= async ()=>{
    try{
        const shipments = await fs.readFile(shipmentPath)
        return JSON.parse(shipments);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
}

const writeShipment= async (shipment) => {
    await fs.writeFile(shipmentPath, JSON.stringify(shipment, null, 2));
};

routerShipment.get('/', async (req, res) =>{
    const shipments = await readShipment(); 
    res.json({"shipments":shipments});
})

routerShipment.get('/:shipmentid', async (req, res)=>{
    const shipments = await readShipment(); 
    const shipment = shipments.find(shipment => shipment.id === parseInt(req.params.shipmentid)); 
    if(!shipment) return res.status(404).send("Shipment not found"); 
    res.json({"shipment":shipment})
});

routerShipment.put('/:shipmentid', async (req,res) =>{
    const warehouseUrl= await fetch((`http://localhost:3000/warehouse/${req.body.warehouseId}`))
    const shipments = await readShipment(); 
    const shipmentIndex = shipments.findIndex(shipment => shipment.id === parseInt(req.params.shipmentid));
    if(shipmentIndex===-1) return res.status(404).send("Shipment not found");
    const updateshipment={
        id: parseInt(req.params.shipmentid),
        item:req.body.item,
        quantity:req.body.quantity,
        warehouseId : await warehouseUrl.json(),
    }
    shipments[shipmentIndex]=updateshipment
    await writeShipment(shipments);
    res.send({message:"shipment updated successfully", shipment: updateshipment});
})

routerShipment.post('/', async (req, res) =>{
    const warehouseUrl= await fetch((`http://localhost:3000/warehouse/${req.body.warehouseId}`));
    const shipments = await readShipment(); 
    const newshipment={
        id: shipments.length+1,
        item:req.body.item,
        quantity:req.body.quantity,
        warehouseId : await warehouseUrl.json(),
    }
    shipments.push(newshipment);
    await writeShipment(shipments);
    res.status(201).send({message:"Shipment created successfully", shipment: newshipment});
})

routerShipment.delete('/:shipmentid', async (req, res) =>{
    const shipments = await readShipment(); 
    const newshipment= shipments.filter(sh=>sh.id !== parseInt(req.params.shipmentid));
    if(newshipment.length === shipments.length) return res.status(404).send("shipment not found");
    await writeShipment(newshipment);
    res.send({message:"Shipment deleted successfully", shipment: newshipment});

})


export default routerShipment
