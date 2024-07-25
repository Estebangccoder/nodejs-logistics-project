import { Router } from "express";
import path from "path";
import {promises as fs} from "fs";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const warehousePath = path.join(_dirname, '../../data/warehouse.json');
const routerWarehouse = Router();


const readWarehouse= async()=>{
    try{
        const warehouse = await fs.readFile(warehousePath)
        return JSON.parse(warehouse);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
}

const writeWarehouse = async (warehouse) => {
    await fs.writeFile(warehousePath, JSON.stringify(warehouse, null, 2));
};

routerWarehouse.get('/', async (req, res) =>{
    const warehouses = await readWarehouse(); 
    res.json({"warehouses":warehouses});
})

routerWarehouse.get('/:warehouseid', async (req, res)=>{
    const warehouses = await readWarehouse(); 
    const warehouse = warehouses.find(warehouse => warehouse.id === parseInt(req.params.warehouseid)); 
    if(!warehouse) return res.status(404).send("Warehouse not found"); 
    res.json({"warehouse":warehouse})
});

routerWarehouse.put('/:warehouseid', async (req,res) =>{
    const warehouses =await readWarehouse();
    const warehouseIndex = warehouses.findIndex(warehouse => warehouse.id === parseInt(req.params.warehouseid));
    if(warehouseIndex===-1) return res.status(404).send("Warehouse not found");
    const updateWarehouse={
        id: parseInt(req.params.warehouseid),
        name:req.body.name,
        location:req.body.location
    }
    warehouses[warehouseIndex]=updateWarehouse
    await writeWarehouse(warehouses);
    res.send({message:"Warehouse updated successfully", warehouse: updateWarehouse});
})

routerWarehouse.post('/', async (req, res) =>{
    const warehouses = await readWarehouse();
    const newWarehouse={
        id: warehouses.length+1,
        name:req.body.name,
        location:req.body.location
    }
    warehouses.push(newWarehouse);
    await writeWarehouse(warehouses);
    res.status(201).send({message:"Warehouse created successfully", warehouse: newWarehouse});
})

routerWarehouse.delete('/:warehouseid', async (req, res) =>{
    const warehouses=await readWarehouse();
    const newWarehouse= warehouses.filter(wh=>wh.id !== parseInt(req.params.warehouseid));
    if(newWarehouse.length === warehouses.length) return res.status(404).send("Warehouse not found");
    await writeWarehouse(newWarehouse);
    res.send({message:"Warehouse deleted successfully", warehouse: newWarehouse});

})


export default routerWarehouse