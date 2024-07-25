import {Router} from "express";
import {promises as fs} from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const driverPath = path.join(__dirname, "../../data/driver.json");
const routerDriver = Router();

const readDriver= async ()=>{
    try{
        const drivers = await fs.readFile(driverPath)
        return JSON.parse(drivers);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
}

const writeDriver= async (driver) => {
    await fs.writeFile(driverPath, JSON.stringify(driver, null, 2));
};

routerDriver.get('/', async (req, res) =>{
    const drivers = await readDriver(); 
    res.json({"drivers":drivers});
})

routerDriver.get('/:driverid', async (req, res)=>{
    const drivers = await readDriver(); 
    const driver = drivers.find(driver => driver.id === parseInt(req.params.driverid)); 
    if(!driver) return res.status(404).send("Driver not found"); 
    res.json({"driver":driver})
});

routerDriver.put('/:driverid', async (req,res) =>{
    const drivers = await readDriver(); 
    const driverIndex = drivers.findIndex(driver => driver.id === parseInt(req.params.driverid));
    if(driverIndex===-1) return res.status(404).send("Driver not found");
    const updatedriver={
        id: parseInt(req.params.driverid),
        name : req.body.name
    }
    drivers[driverIndex]=updatedriver
    await writeDriver(drivers);
    res.send({message:"driver updated successfully", driver: updatedriver});
})

routerDriver.post('/', async (req, res) =>{
    
    const drivers = await readDriver(); 
    const newDriver={
        id: drivers.length+1,
        name : req.body.name
    }
    drivers.push(newDriver);
    await writeDriver(drivers); 
    res.status(201).send({message:"Driver created successfully", driver: newDriver});
})

routerDriver.delete('/:driverid', async (req, res) =>{
    const drivers = await readDriver(); 
    const newDriver= drivers.filter(driver=>driver.id !== parseInt(req.params.driverid));
    if(newDriver.length === drivers.length) return res.status(404).send("driver not found");
    await writeDriver(newDriver);
    res.send({message:"Driver deleted successfully", driver: newDriver});

})


export default routerDriver
